// dummyDataGenerator.js

const casual = require('casual');
const Products = require('./models/productsModel');

// Function to generate dummy products
const generateDummyProducts = async () => {
  const dummyProducts = [];

  for (let i = 1; i <= 10; i++) {
    const product = {
      artisnaId: casual.uuid,
      displayPic: casual.random_element(['base64encodedImage1', 'base64encodedImage2']),
      name: casual.word,
      price: casual.integer(10, 100).toString(),
      description: casual.sentence,
      quantity: casual.integer(1, 20),
      otherPics: [
        casual.random_element(['base64encodedImage3', 'base64encodedImage4']),
        casual.random_element(['base64encodedImage5', 'base64encodedImage6']),
      ],
    };

    dummyProducts.push(product);
  }

  return dummyProducts;
};

// Function to save dummy products to the database
const saveDummyProducts = async () => {
  try {
    const dummyProducts = await generateDummyProducts();
    await Products.create(dummyProducts);
    console.log('Dummy products added to the database.');
  } catch (error) {
    console.error('Error adding dummy products:', error);
  }
};

// Export the function to be used in other files
module.exports = saveDummyProducts;
