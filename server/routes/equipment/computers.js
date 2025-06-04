const express = require('express');
const router = express.Router();
const computerController = require('../../controllers/equipment/computerController');
const { protect, authorize } = require('../../middleware/auth');

// Rotas protegidas
router.get('/', protect, computerController.getAllComputers);
router.get('/stats', protect, computerController.getComputerStats);
router.get('/:id', protect, computerController.getComputerById);
router.post('/', protect, computerController.createComputer);
router.put('/:id', protect, computerController.updateComputer);
router.delete('/:id', protect, authorize('admin', 'manager'), computerController.deleteComputer);

module.exports = router;