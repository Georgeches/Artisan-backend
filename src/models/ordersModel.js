const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: String,
  customer_id: { type: String, ref: 'Customer' },
  items: [{ product_id: { type: String, ref: 'Product' }, artisan_id: { type: String, ref: 'Artisan' }, quantity: Number }],
  status: String,
  payment_status: Boolean,
  shipping_fee: String,
  amount: String
}, { timestamps: true });

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
