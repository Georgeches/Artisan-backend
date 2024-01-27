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
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});

const Artisan = mongoose.model('Artisan', artisanSchema);

module.exports = Artisan;
