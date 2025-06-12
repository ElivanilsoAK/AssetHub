const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  auth: {
    login: (username, password) => ipcRenderer.invoke('auth:login', username, password)
  },
  users: {
    getAll: () => ipcRenderer.invoke('users:getAll'),
    create: (userData) => ipcRenderer.invoke('users:create', userData)
  },
  departments: {
    getAll: () => ipcRenderer.invoke('departments:getAll'),
    create: (name) => ipcRenderer.invoke('departments:create', name)
  },
  printers: {
    getAll: () => ipcRenderer.invoke('printers:getAll'),
    create: (printerData) => ipcRenderer.invoke('printers:create', printerData),
    update: (id, printerData) => ipcRenderer.invoke('printers:update', id, printerData),
    delete: (id) => ipcRenderer.invoke('printers:delete', id),
    getMaintenance: (printerId) => ipcRenderer.invoke('printers:getMaintenance', printerId),
    addMaintenance: (maintenanceData) => ipcRenderer.invoke('printers:addMaintenance', maintenanceData),
    updateCounter: (id, counter) => ipcRenderer.invoke('printers:updateCounter', id, counter)
  },
  toners: {
    getAll: () => ipcRenderer.invoke('toners:getAll'),
    create: (tonerData) => ipcRenderer.invoke('toners:create', tonerData),
    update: (id, tonerData) => ipcRenderer.invoke('toners:update', id, tonerData),
    delete: (id) => ipcRenderer.invoke('toners:delete', id),
    getMovements: (tonerId) => ipcRenderer.invoke('toners:getMovements', tonerId),
    addMovement: (movementData) => ipcRenderer.invoke('toners:addMovement', movementData)
  },
  notebooks: {
    getAll: () => ipcRenderer.invoke('notebooks:getAll'),
    create: (notebookData) => ipcRenderer.invoke('notebooks:create', notebookData),
    update: (id, notebookData) => ipcRenderer.invoke('notebooks:update', id, notebookData),
    delete: (id) => ipcRenderer.invoke('notebooks:delete', id),
    getPeripherals: (notebookId) => ipcRenderer.invoke('notebooks:getPeripherals', notebookId),
    addPeripheral: (peripheralData) => ipcRenderer.invoke('notebooks:addPeripheral', peripheralData),
    updatePeripheral: (id, peripheralData) => ipcRenderer.invoke('notebooks:updatePeripheral', id, peripheralData),
    deletePeripheral: (id) => ipcRenderer.invoke('notebooks:deletePeripheral', id)
  },
  smartphones: {
    getAll: () => ipcRenderer.invoke('smartphones:getAll'),
    create: (smartphoneData) => ipcRenderer.invoke('smartphones:create', smartphoneData),
    update: (id, smartphoneData) => ipcRenderer.invoke('smartphones:update', id, smartphoneData),
    delete: (id) => ipcRenderer.invoke('smartphones:delete', id)
  },
  bags: {
    getAll: () => ipcRenderer.invoke('bags:getAll'),
    create: (bagData) => ipcRenderer.invoke('bags:create', bagData),
    update: (id, bagData) => ipcRenderer.invoke('bags:update', id, bagData),
    delete: (id) => ipcRenderer.invoke('bags:delete', id)
  },
  tools: {
    getAll: () => ipcRenderer.invoke('tools:getAll'),
    create: (toolData) => ipcRenderer.invoke('tools:create', toolData),
    update: (id, toolData) => ipcRenderer.invoke('tools:update', id, toolData),
    delete: (id) => ipcRenderer.invoke('tools:delete', id)
  },
  serviceOrders: {
    getAll: () => ipcRenderer.invoke('serviceOrders:getAll'),
    create: (orderData) => ipcRenderer.invoke('serviceOrders:create', orderData),
    update: (id, orderData) => ipcRenderer.invoke('serviceOrders:update', id, orderData),
    delete: (id) => ipcRenderer.invoke('serviceOrders:delete', id),
    close: (id, closeData) => ipcRenderer.invoke('serviceOrders:close', id, closeData)
  },
  reports: {
    getPrinterCosts: (startDate, endDate) => ipcRenderer.invoke('reports:getPrinterCosts', startDate, endDate),
    getInventorySummary: () => ipcRenderer.invoke('reports:getInventorySummary'),
    getTonerUsage: (startDate, endDate) => ipcRenderer.invoke('reports:getTonerUsage', startDate, endDate),
    getServiceOrdersSummary: (startDate, endDate) => ipcRenderer.invoke('reports:getServiceOrdersSummary', startDate, endDate)
  }
});