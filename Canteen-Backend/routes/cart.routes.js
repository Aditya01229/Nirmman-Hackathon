// routes/cart.routes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCart);
router.put('/update', cartController.updateCartItem);
router.delete('/:userId/item/:menuItemId', cartController.removeFromCart);
router.delete('/:userId/clear', cartController.clearCart);

module.exports = router;