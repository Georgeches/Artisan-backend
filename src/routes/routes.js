const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const artisanController = require('../controllers/artisanController'); 
const customerController = require('../controllers/customerController'); 
const productController = require('../controllers/productController'); 

// Authentication Routes
router.post('/auth/artisan/login', authController.loginArtisan);
router.post('/auth/customer/login', authController.loginCustomer);
router.post('/logout', authController.logout);
router.post('/auth/artisan/refresh', authController.refreshArtisanToken);
router.post('/auth/customer/refresh', authController.refreshCustomerToken);

// Artisan Routes
router.get('/artisans', artisanController.getAllArtisans);
router.get('/artisans/:id', artisanController.getArtisanById);
router.post('/artisans', artisanController.createArtisan);

// Customer Routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.post('/customers', customerController.createCustomer);

// Product Routes
router.get('/products', productController.getAllProducts);
router.post('/products', productController.createProduct);

module.exports = router;
