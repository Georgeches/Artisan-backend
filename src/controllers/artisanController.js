const bcrypt = require('bcrypt');
const Artisan = require('../models/artisanModel');

exports.getAllArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find();
    res.status(200).json(artisans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

exports.createArtisan = async (req, res) => {
  try {
    //console.log(req.body);
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
      
   const artisan = new Artisan({ name, email, password:hashedPassword });
    await artisan.save();
    res.status(201).json(artisan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.getArtisanById = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }
    res.status(200).json(artisan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

