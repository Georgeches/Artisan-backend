const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  profilePic: String,
  password: { type: String, required: true },
  location: String,
  town: String,          
  county: String,        
  profilepic: String,    
  coverphoto: String,
  about: { type: String, maxlength: 5000 },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
},{timestamps:true});

const Artisan = mongoose.model('Artisan', artisanSchema);

module.exports = Artisan;
