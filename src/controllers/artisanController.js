const bcrypt = require('bcrypt');
const Artisan = require('../models/artisanModel');
const path = require('path');
const fs = require('fs');
const multer=require('multer')
const storage = multer.memoryStorage(); // Store files in memory as buffers
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only (jpeg, jpg, png)!');
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

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

exports.uploadProfilePic = upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    // Converting the buffer to base64
    const base64Image = req.file.buffer.toString('base64');

    // Saving user info and uploaded photo
    const artisan = new Artisan({
      name,
      email,
      password: hashedPassword,
      profilePic: base64Image,
    });
    await artisan.save();

    res.status(201).json({ message: 'File uploaded successfully', artisan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};