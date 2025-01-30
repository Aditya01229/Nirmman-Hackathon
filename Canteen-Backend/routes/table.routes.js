// routes/table.routes.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');

router.post('/book', tableController.bookTable);
router.get('/', tableController.getAllTables);
router.post('/release/:tableNumber', tableController.releaseTable);

module.exports = router;