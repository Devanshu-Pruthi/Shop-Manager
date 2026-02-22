const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
const customerRoutes = require('./routes/customer.routes');
app.use('/api/customers', customerRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Shop Manager API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
