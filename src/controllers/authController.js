const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Artisan = require('../models/artisanModel');
const Customer = require('../models/customerModel');

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });
};

// Login for Artisans
exports.loginArtisan = async (req, res) => {
  try {
    const { email, password } = req.body;
    const artisan = await Artisan.findOne({ email });

    if (!artisan) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, artisan.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(artisan._id);
    res.status(200).json({ userId: artisan._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login for Customers
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(customer._id);
    res.status(200).json({ userId: customer._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// exports.logout = (req, res) => {
  
//   res.status(200).json({ message: 'Logout successful' });
// };
