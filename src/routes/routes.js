const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const artisanController = require('../controllers/artisanController');
const customerController = require('../controllers/customerController');
const productController = require('../controllers/productController');
const odersController = require('../controllers/odersController')

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
router.get('/products/:id', productController.getSingleProduct);
router.post('/products', productController.createProduct);
router.patch('/products', productController.UpdateProduct)
router.delete('/products/:id', productController.deleteProduct);

// order route
router.post('/order', odersController.placeOrder);
router.get('/orders', odersController.getAllOrders);
router.patch('/myorders/:id', odersController.updateMyOrders);
router.delete('/myorders/:id', odersController.deleteOrder);

module.exports = router;
