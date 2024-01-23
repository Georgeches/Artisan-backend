const Products = require('../models/productsModel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { artisnaId, displayPic, name, price, description, quantity, otherPics } = req.body;

    // Assuming displayPic and otherPics are base64-encoded strings
    const displayPicBuffer = Buffer.from(displayPic, 'base64');
    const otherPicsBuffers = otherPics.map((pic) => Buffer.from(pic, 'base64'));

    const product = new Products({
      artisnaId,
      displayPic: displayPicBuffer,
      name,
      price,
      description,
      quantity,
      otherPics: otherPicsBuffers,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
