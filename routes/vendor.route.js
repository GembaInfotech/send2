'use strict';
const router = require("express").Router();
const vendorController = require("../controllers/vendor.controller")
const decodeToken = require("../middlewares/auth/decodeToken");
const { uploadPhoto, parkingImgResize } = require("../middlewares/ImageUpload/upload");
const upload = require("../utils/UploadImage/upload")
const uploadMultipleForVendor = require('../utils/UploadImage/uploadMultiple')

router.route('/create-new-vendor').post(vendorController.addVendor);
router.route('/vendor-login').post( vendorController.signin);
router.route('/get-vendor').get(decodeToken,vendorController.getVendor);

router.route('/get-all-vendor/:gteId').get(vendorController.getAllVendor);
router.route('/get-all-vendors').get(vendorController.getVendors);

router.route('/update-vendor').put(decodeToken,vendorController.updateVendor);
router.route('/update-vendor/:vednorId').put(decodeToken,vendorController.updateVendorById);
router.route('/update-vendor-status').put(decodeToken,vendorController.updateVendorStatus);
router.delete("/logout", decodeToken,  vendorController.logout);
router.post("/refresh-token", vendorController.refreshToken);

router.route('/gst-card').post(uploadPhoto.single('file'), parkingImgResize, vendorController.gstUpload);
router.route('/business-licence').post(uploadPhoto.single('file'), parkingImgResize, vendorController.businessLicenceUpload);


router.route('/profile-image').post(upload.single('profileImage'),vendorController.profileUpload);
router.route('/send-profile/:image').get(vendorController.sendProfile);


router.route('/upload-docs').post(uploadMultipleForVendor, vendorController.uploadDocs);
router.route('/send-docs/:type/:image').get(vendorController.sendDocs);



module.exports =router