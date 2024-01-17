const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const artisanController = require('../controllers/artisanController'); // <-- Adjust path if needed
const customerController = require('../controllers/customerController'); // <-- Adjust path if needed

// Authentication Routes
router.post('/auth/artisan/login', authController.loginArtisan);
router.post('/auth/customer/login', authController.loginCustomer);

// Artisan Routes
router.get('/artisans', artisanController.getAllArtisans);
router.get('/artisans/:id', artisanController.getArtisanById);

// Customer Routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);

module.exports = router;
