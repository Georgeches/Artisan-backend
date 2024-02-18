const bcrypt = require('bcrypt');
const Artisan = require('../models/artisanModel');
const multer = require('multer');
 const fs = require('fs');
const{S3Client,PutObjectCommand} =require("@aws-sdk/client-s3")
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

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
  const fileContent = await fs.readFile(path);
  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Body: fileContent,
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read',
  }));
  return `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
}

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

exports.createArtisan = upload.single('image'), async (req, res) => {

exports.createArtisan =  async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }


    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const artisanReq = req.body


      const hashedPassword = await hashPassword(password);

      const artisan = new Artisan({
        name,
        email,
        password: hashedPassword,
        profilePic: url,
        phone,
        town,
        location,
        county,
      });
    const artisan = new Artisan({
      ...artisanReq,
      password: hashedPassword,
      profilepic: artisanReq.profilePicture
      // profilePic: req.file.buffer.toString('base64'),
    });
    console.log(artisanReq.profilePicture)


      await artisan.save();

      res.status(201).json(artisan);
    } catch (uploadError) {
      console.error('Error uploading to S3:', uploadError);
      res.status(500).json({ message: 'Error uploading to S3' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
