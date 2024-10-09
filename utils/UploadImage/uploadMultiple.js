const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.body.uploadType);
        
        let uploadType = req.body.uploadType; 
        console.log(req.body);
        
        let folder = '';

        if (uploadType === 'vendorGST') {
            folder = 'VendorGST';
        } else if (uploadType === 'vendorAadhar') {
            folder = 'VendorAadhar';
        } else if (uploadType === 'vendorLicense') {
            folder = 'VendorLicense';
        } else if (uploadType === 'vendorPan') {
            folder = 'VendorPan';
        } else {
            return cb(new Error('Invalid upload type'));
        }

        cb(null, path.join(__dirname, '..', '..', 'ProfileImage', folder));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg, and .pdf formats allowed!'));
        }
    }
});

const uploadMultipleForVendor = upload.array('files', 2); // 'files' is the key from the form, and 2 is the file limit

module.exports = uploadMultipleForVendor;
