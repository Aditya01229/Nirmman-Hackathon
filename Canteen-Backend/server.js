// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbconfig.js');
const orderRoutes = require('./routes/order.routes.js');
const tableRoutes = require('./routes/table.routes.js');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/menu', require('./routes/menu.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
// Add to server.js (add with other routes)
app.use('/api/checkout', require('./routes/checkout.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});