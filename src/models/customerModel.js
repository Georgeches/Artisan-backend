const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: false },
  address: String,
  phone: String,
  city: String,
  country: String,
},{timestamps:true});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
