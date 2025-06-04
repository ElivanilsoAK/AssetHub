const express = require('express');
const router = express.Router();
const bagController = require('../../controllers/equipment/bagController');
const { protect, authorize } = require('../../middleware/auth');

// Rotas protegidas
router.get('/', protect, bagController.getAllBags);
router.get('/:id', protect, bagController.getBagById);
router.post('/', protect, bagController.createBag);
router.put('/:id', protect, bagController.updateBag);
router.delete('/:id', protect, authorize('admin', 'manager'), bagController.deleteBag);

module.exports = router;