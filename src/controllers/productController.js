const{S3Client,PutObjectCommand} =require("@aws-sdk/client-s3")
const Products = require('../models/productsModel');
const multer = require('multer');
const fs = require('fs')

const bucketName=process.env.BUCKET_NAME
const bucketRegion=process.env.BUCKET_REGION
const accessKey=process.env.ACCESS_KEY
const secretAccessKey=process.env.SECRET_ACCESS_KEY

const upload = multer({
  storage: multer.memoryStorage(),
});

async function uploadToS3(path, originalFilename, mimetype) {
  const client=new S3Client({
    credentials:{
        accessKeyId:accessKey,
        secretAccessKey:secretAccessKey
    },
    region:bucketRegion
  })
  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    //ACL: 'public-read',
  }));
  return `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();

    if(!products) res.status(404).json({message: "Error occured while fetching products"})

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createProduct = upload.array("photos", 8), async (req, res) => {
  try {
    const { artisnaId, name, price, description, quantity } = req.body;

    const uploadPromises = req.files.map(async (file) => {
      const { path, originalname, mimetype } = file;
      const url = await uploadToS3(path, originalname, mimetype);
      return url;
    });

    const otherPictures = await Promise.all(uploadPromises);

    const product = new Products({
      artisnaId,
      displayPic: otherPictures[0],
      name,
      price,
      description,
      quantity,
      otherPics: otherPictures,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.UpdateProduct = async(req,res) =>{

}

exports.deleteProduct = async (req, res) => {
  try {
    
    const productId = req.params.id

    const product = await Products.findById(productId)

    if(!product) return res.status(404).json({message: "Product not found"})

    product.remove()

    res.status(200).json({message: "Product Deleted"})

  } catch (error) {
    res.status(500).json({message: "Internal serve error"})
  }
}