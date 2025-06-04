// server/routes/equipment/mobileDevices.js
const express = require('express');
const router = express.Router();
const mobileDeviceController = require('../../controllers/equipment/mobileDeviceController'); // Corrigido o nome do controlador
const { protect, authorize } = require('../../middleware/auth'); //

// Rotas protegidas
router.get('/', protect, mobileDeviceController.getAllMobileDevices);
router.get('/:id', protect, mobileDeviceController.getMobileDeviceById);
router.post('/', protect, mobileDeviceController.createMobileDevice);
router.put('/:id', protect, mobileDeviceController.updateMobileDevice);
router.delete('/:id', protect, authorize('admin', 'manager'), mobileDeviceController.deleteMobileDevice);

module.exports = router;