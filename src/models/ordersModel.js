const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: String,
  customer_id: { type: String, ref: 'Customer' },
  items: [String],
  status: String,
  payment_status: Boolean,
  shipping_fee: String,
  amount: String
}, { timestamps: true });

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
