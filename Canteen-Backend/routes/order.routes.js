// routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:orderCode', orderController.getOrderByCode);
router.patch('/:orderCode', orderController.updateOrderStatus);

module.exports = router;