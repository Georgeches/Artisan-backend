const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Artisan = require('../models/artisanModel');
const Customer = require('../models/customerModel');

const generateToken = (userId) => {
  return jwt.sign({ userId },process.env.ACCESS_TOKEN, { expiresIn: '1h' });
};

// Login for Artisans
exports.loginArtisan = async (req, res) => {
  try {
    const { email, password } = req.body;
    const artisan = await Artisan.findOne({ email });

    if (!artisan) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, artisan.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(artisan._id);

    // Generate refresh token
    const refreshToken = jwt.sign(
      { "id": artisan._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,      // Accessible only by a web server
      secure: true,        // HTTPS
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiry: set to match refresh token
    });

    // Send the response
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
      return res.status(401).json({ message: 'Email not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    const token = generateToken(customer._id);

    // Generate refresh token
    const refreshToken = jwt.sign(
      { "email": customer.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,      // Accessible only by a web server
      secure: true,        // HTTPS
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiry: set to match refresh token
    });

    // Send the response
    res.status(200).json({ userId: customer._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error
   });
  }
};

exports.logout = (req, res) => {
  try {
    // Clear the JWT cookie by setting an expired date
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0),
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Refresh Token for Artisans
exports.refreshArtisanToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    // You may want to check the decoded token against your database to ensure its validity
    const artisan = await Artisan.findById(decodedToken.id);

    if (!artisan) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateToken(artisan._id);

    res.status(200).json({ userId: artisan._id, token: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Refresh Token for Customers
exports.refreshCustomerToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    // You may want to check the decoded token against your database to ensure its validity
    const customer = await Customer.findOne({ email: decodedToken.email });

    if (!customer) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateToken(customer._id);

    res.status(200).json({ userId: customer._id, token: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};