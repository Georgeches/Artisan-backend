const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: String,
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  phone: String,
  country: String,
},{timestamps:true});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
