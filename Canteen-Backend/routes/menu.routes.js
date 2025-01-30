// routes/menu.routes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.post('/', menuController.createMenuItem);
router.get('/', menuController.getAllMenuItems);
router.get('/category/:category', menuController.getMenuByCategory);
router.get('/:id', menuController.getMenuItemById);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);
router.patch('/:id/toggle-availability', menuController.toggleAvailability);

module.exports = router;
