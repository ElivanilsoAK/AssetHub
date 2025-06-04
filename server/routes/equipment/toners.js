// server/routes/equipment/toners.js
const express = require('express');
const router = express.Router();
const tonerController = require('../../controllers/equipment/tonerController'); // Certifique-se de que o controlador é referenciado corretamente
const { protect, authorize } = require('../../middleware/auth'); //

// Rotas protegidas
router.get('/', protect, tonerController.getAllToners);
router.get('/:id', protect, tonerController.getTonerById);
router.post('/', protect, tonerController.createToner);
router.put('/:id', protect, tonerController.updateToner);
router.delete('/:id', protect, authorize('admin', 'manager'), tonerController.deleteToner);

module.exports = router;