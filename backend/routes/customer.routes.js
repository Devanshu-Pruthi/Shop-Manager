const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

// Create a new customer
router.post('/', customerController.create);

// Retrieve all customers
router.get('/', customerController.findAll);

// Retrieve a single customer with id
router.get('/:id', customerController.findOne);

// Update a customer with id
router.put('/:id', customerController.update);

// Delete a customer with id
router.delete('/:id', customerController.delete);

module.exports = router;
