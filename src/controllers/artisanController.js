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

