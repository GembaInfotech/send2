'use strict';
const router = require("express").Router();
const vendorController = require("../controllers/vendor.controller")
const decodeToken = require("../middlewares/auth/decodeToken");


router.route('/create-new-vendor').post(vendorController.addVendor);
// router.route('/update-vendor/:vendorId').put(vendorController.update_vendor); 
// router.route('/view-vendor-list').get(vendorController.view_vendor_list); 
// router.route('/delete-vendor/:vendorId').delete( vendorController.delete_vendor);
router.route('/vendor-login').post( vendorController.signin);
router.route('/get-vendor').get(decodeToken,vendorController.getVendor);
router.route('/get-all-vendor').get(vendorController.getAllVendor);

router.route('/update-vendor').put(decodeToken,vendorController.updateVendor);
router.route('/update-vendor-status').put(decodeToken,vendorController.updateVendorStatus);
router.post("/logout", vendorController.logout);
router.post("/refresh-token", vendorController.refreshToken);


module.exports =router