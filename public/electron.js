const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('better-sqlite3');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => (mainWindow = null));

  // Inicializar o banco de dados
  initDatabase();
}

function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'assethub.db');
  db = new Database(dbPath);
  
  // Criar tabelas se não existirem
  createTables();
  
  // Configurar handlers para operações de banco de dados
  setupDatabaseHandlers();
}

function createTables() {
  // Tabela de usuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabela de setores
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  // Tabela de impressoras
  db.exec(`
    CREATE TABLE IF NOT EXISTS printers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      serial_number TEXT UNIQUE,
      department_id INTEGER,
      status TEXT NOT NULL,
      counter_last_month INTEGER DEFAULT 0,
      counter_current INTEGER DEFAULT 0,
      monthly_cost REAL,
      acquisition_date TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );
  `);

  // Tabela de manutenção de impressoras
  db.exec(`
    CREATE TABLE IF NOT EXISTS printer_maintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      printer_id INTEGER NOT NULL,
      maintenance_type TEXT NOT NULL,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP,
      description TEXT,
      cost REAL,
      service_order TEXT,
      FOREIGN KEY (printer_id) REFERENCES printers(id)
    );
  `);

  // Tabela de toners
  db.exec(`
    CREATE TABLE IF NOT EXISTS toners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      compatible_printers TEXT NOT NULL,
      status TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 1,
      pages_capacity INTEGER
    );
  `);

  // Tabela de movimentação de toners
  db.exec(`
    CREATE TABLE IF NOT EXISTS toner_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      toner_id INTEGER NOT NULL,
      printer_id INTEGER,
      movement_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER NOT NULL,
      notes TEXT,
      FOREIGN KEY (toner_id) REFERENCES toners(id),
      FOREIGN KEY (printer_id) REFERENCES printers(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Tabela de notebooks
  db.exec(`
    CREATE TABLE IF NOT EXISTS notebooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      serial_number TEXT UNIQUE,
      processor TEXT,
      ram TEXT,
      storage TEXT,
      warranty_expiration TIMESTAMP,
      status TEXT NOT NULL,
      user_id INTEGER,
      department_id INTEGER,
      acquisition_date TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );
  `);

  // Tabela de periféricos de notebooks
  db.exec(`
    CREATE TABLE IF NOT EXISTS notebook_peripherals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notebook_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      model TEXT,
      serial_number TEXT,
      status TEXT NOT NULL,
      FOREIGN KEY (notebook_id) REFERENCES notebooks(id)
    );
  `);

  // Tabela de celulares
  db.exec(`
    CREATE TABLE IF NOT EXISTS smartphones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      serial_number TEXT,
      imei TEXT UNIQUE,
      status TEXT NOT NULL,
      user_id INTEGER,
      department_id INTEGER,
      acquisition_date TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );
  `);

  // Tabela de mochilas
  db.exec(`
    CREATE TABLE IF NOT EXISTS bags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      condition TEXT NOT NULL,
      status TEXT NOT NULL,
      user_id INTEGER,
      department_id INTEGER,
      acquisition_date TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );
  `);

  // Tabela de ferramentas e equipamentos
  db.exec(`
    CREATE TABLE IF NOT EXISTS tools_equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      model TEXT,
      brand TEXT,
      asset_number TEXT,
      status TEXT NOT NULL,
      department_id INTEGER,
      user_id INTEGER,
      acquisition_date TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Tabela de ordens de serviço
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_type TEXT NOT NULL,
      asset_id INTEGER NOT NULL,
      service_provider TEXT NOT NULL,
      description TEXT NOT NULL,
      open_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      close_date TIMESTAMP,
      status TEXT NOT NULL,
      cost REAL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Inserir usuário admin padrão se não existir
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    db.prepare('INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)')
      .run('admin', 'admin123', 'Administrador', 'admin');
  }
}

function setupDatabaseHandlers() {
  // Autenticação
  ipcMain.handle('auth:login', (event, username, password) => {
    const user = db.prepare('SELECT id, username, name, role FROM users WHERE username = ? AND password = ?')
      .get(username, password);
    return user || null;
  });

  // Usuários
  ipcMain.handle('users:getAll', () => {
    return db.prepare('SELECT id, username, name, role FROM users').all();
  });

  ipcMain.handle('users:create', (event, userData) => {
    const { username, password, name, role } = userData;
    try {
      const result = db.prepare('INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)')
        .run(username, password, name, role);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Setores
  ipcMain.handle('departments:getAll', () => {
    return db.prepare('SELECT * FROM departments').all();
  });

  ipcMain.handle('departments:create', (event, name) => {
    try {
      const result = db.prepare('INSERT INTO departments (name) VALUES (?)')
        .run(name);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Impressoras
  ipcMain.handle('printers:getAll', () => {
    return db.prepare(`
      SELECT p.*, d.name as department_name 
      FROM printers p 
      LEFT JOIN departments d ON p.department_id = d.id
    `).all();
  });

  ipcMain.handle('printers:create', (event, printerData) => {
    try {
      const result = db.prepare(`
        INSERT INTO printers (
          model, serial_number, department_id, status, 
          counter_last_month, counter_current, monthly_cost, acquisition_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        printerData.model,
        printerData.serial_number,
        printerData.department_id,
        printerData.status,
        printerData.counter_last_month || 0,
        printerData.counter_current || 0,
        printerData.monthly_cost || 0,
        printerData.acquisition_date
      );
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Adicione handlers para os outros módulos de forma similar
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});