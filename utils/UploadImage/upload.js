const { log } = require('console');
const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(req.type)
        
        let profileType = req.type || 1; // Get the profile type from the request body

        let folder = '';

        if (profileType === 2) {
            folder = 'GuardProfileImg';
        } else if (profileType === 1) {
            folder = 'VendorProfileImg';
        } else {
            return cb(new Error('Invalid profile type'));
        }

        cb(null, path.join(__dirname,'..', '..', 'ProfileImage', folder));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize upload middleware
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB file size limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, and .jpeg format allowed!'));
        }
    }
});

module.exports = upload;
