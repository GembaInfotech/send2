'use strict';
const router = require("express").Router();
const vendorController = require("../controllers/vendor.controller")
const decodeToken = require("../middlewares/auth/decodeToken");

const { uploadPhoto, parkingImgResize } = require("../middlewares/ImageUpload/upload");


router.route('/create-new-vendor').post(vendorController.addVendor);
// router.route('/update-vendor/:vendorId').put(vendorController.update_vendor); 
// router.route('/view-vendor-list').get(vendorController.view_vendor_list); 
// router.route('/delete-vendor/:vendorId').delete( vendorController.delete_vendor);
router.route('/vendor-login').post( vendorController.signin);
router.route('/get-vendor').get(decodeToken,vendorController.getVendor);
router.route('/get-all-vendor/:gteId').get(vendorController.getAllVendor);
router.route('/get-all-vendors').get(vendorController.getVendors);



router.route('/update-vendor').put(decodeToken,vendorController.updateVendor);
router.route('/update-vendor/:vednorId').put(decodeToken,vendorController.updateVendorById);
router.route('/update-vendor-status').put(decodeToken,vendorController.updateVendorStatus);
router.delete("/logout", decodeToken,  vendorController.logout);
router.post("/refresh-token", vendorController.refreshToken);

router.route('/pan-image').post(uploadPhoto.single('file'), parkingImgResize, vendorController.panUpload);
router.route('/adhaar-image').post(uploadPhoto.single('file'), parkingImgResize, vendorController.adhaarUpload);
router.route('/profile-image').post(uploadPhoto.single('file'), parkingImgResize, vendorController.profileUpload);



module.exports =router