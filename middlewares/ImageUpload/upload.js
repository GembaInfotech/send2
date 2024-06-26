const multer = require('multer')
const  sharp = require('sharp')
 const path = require('path')
const  fileURLToPath = require( "url");

const fs = require('fs');
const dirname = require('path');
const uploadImg = require('./cloudinary');

const filename = __filename; 

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, path.join( __dirname, "../../assets/userAvatars"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
  
});

const dir = async (req, res) => {
  console.log(path.join( __dirname, "../../assets/userAvatars"));
};

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

const parkingImgResize = async (req, res, next) => {
  console.log("heyer" + __dirname);
  console.log(req?.file)
  if (!req.file) return next();
  const files = [];
  files.push(req.file);

  await Promise.all(
    files.map(async (file) => {
      const destinationPath = (__dirname,  `../../assets/userAvatars/${file.filename}`);
        console.log(destinationPath)

      

      const path= await uploadImg(destinationPath)
      console.log(path);
      req.imagepath = path;
    })
  );
  next();
};

module.exports = { uploadPhoto, parkingImgResize, dir };
