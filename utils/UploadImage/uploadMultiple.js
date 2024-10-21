const multer = require('multer');
const path = require('path');

// Define the storage configuration with dynamic folder paths
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath = 'ProfileImage'; // Base folder

    // Determine the folder based on the file field name
    switch (file.fieldname) {
      case 'gstDocument':
        folderPath = path.join(__dirname, '../../ProfileImage/VendorGST');
        break;
      case 'aadhaarDocument':
        folderPath = path.join(__dirname, '../../ProfileImage/VendorAadhar');
        break;
      case 'businessLicenseDocument':
        folderPath = path.join(__dirname, '../../ProfileImage/VendorLicense');
        break;
      case 'panDocument':
        folderPath = path.join(__dirname, '../../ProfileImage/VendorPan');
        break;
      default:
        folderPath = path.join(__dirname, '../../ProfileImage');
    }
    cb(null, folderPath); // Set the destination folder
  },
  filename: (req, file, cb) => {
    // Set a unique filename for each uploaded document
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only PDFs (or other specific file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf']; // Add other MIME types if needed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Limit the file size to 5MB
});

module.exports = upload;
