const bcrypt = require('bcrypt');
const Artisan = require('../models/artisanModel');
const multer = require('multer');
// const fs = require('fs');

const upload = multer();

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

exports.createArtisan =  async (req, res) => {
  try {

    // if (!req.file) {
    //   return res.status(400).json({ message: 'No file uploaded!' });
    // }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const artisanReq = req.body

    const hashedPassword = await hashPassword(password);

    const artisan = new Artisan({
      ...artisanReq,
      password: hashedPassword,
      profilepic: artisanReq.profilePicture
      // profilePic: req.file.buffer.toString('base64'),
    });
    console.log(artisanReq.profilePicture)

    await artisan.save();
    
    res.status(201).json(artisan);
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

// exports.uploadProfilePic =  async (req, res) => {
//   try {
    

//     const { name, email, password } = req.body;
//     const hashedPassword = await hashPassword(password);

//     // Saving user info and uploaded photo
 
//     await artisan.save();

//     res.status(201).json({ message: 'File uploaded successfully', artisan });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
