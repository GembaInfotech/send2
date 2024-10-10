const multer = require('multer');
const path = require('path');

// Multer storage configuration for parking images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = 'ParkingImg'; // Define folder for parking images
        cb(null, path.join(__dirname, '..','..', 'ProfileImage', folder)); // Set the storage path
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Create unique filename
    }
});

// File filter to only allow specific image formats
const fileFilter = function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg, and .jpeg formats are allowed!'));
    }
};

// Multer configuration with file size and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Limit file size to 5MB per image
    },
    fileFilter: fileFilter
});

// Limit to 5 files for parking images
const uploadParkingImages = upload.array('files', 5); // 5 is the file limit

module.exports = uploadParkingImages;
