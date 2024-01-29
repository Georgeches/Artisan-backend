const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
  artisanId: String,
  displayPic: String,
  name: String,
  price: String,
  description: String, 
  quantity: Number,
  otherPics: [String], 
}, { timestamps: true }); 

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
