const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./database/database');
// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rotas
const authRoutes = require('./routes/auth');
const computerRoutes = require('./routes/equipment/computers');
const mobileDeviceRoutes = require('./routes/equipment/mobileDevices'); // Certifique-se de que este arquivo existe e exporta um router
const bagRoutes = require('./routes/equipment/bags');
const printerRoutes = require('./routes/equipment/printers'); // Certifique-se de que este arquivo existe e exporta um router
const tonerRoutes = require('./routes/equipment/toners'); // Certifique-se de que este arquivo existe e exporta um router


// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/equipment/computers', computerRoutes);
app.use('/api/equipment/mobile-devices', mobileDeviceRoutes);
app.use('/api/equipment/bags', bagRoutes);
app.use('/api/equipment/printers', printerRoutes);
app.use('/api/equipment/toners', tonerRoutes);


// Rota básica para teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do AssetHUB!' });
});

// Sincronizar modelos com o banco de dados
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
  }
};

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await syncDatabase();
});