// server/routes/equipment/printers.js
const express = require('express');
const router = express.Router();
const printerController = require('../../controllers/equipment/printerController'); // Certifique-se de que o controlador é referenciado corretamente
const { protect, authorize } = require('../../middleware/auth'); //

// Rotas protegidas
router.get('/', protect, printerController.getAllPrinters);
router.get('/:id', protect, printerController.getPrinterById);
router.post('/', protect, printerController.createPrinter);
router.put('/:id', protect, printerController.updatePrinter);
router.delete('/:id', protect, authorize('admin', 'manager'), printerController.deletePrinter);

module.exports = router;