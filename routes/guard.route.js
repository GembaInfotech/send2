'use strict';
const router = require("express").Router();
const guardController = require('../controllers/guard.controller')
const decodeToken = require("../middlewares/auth/decodeToken");
const upload = require("../utils/UploadImage/upload")
const guardAuthentication = require('../middlewares/auth/guardAuth')

router.route('/create-new-guard/:parkingid').post(decodeToken,guardController.addGuard);
router.route('/guard-login').post( guardController.signin);
router.route('/logout').delete( guardController.logout);
router.route('/get-guard/:guardId').get( guardController.getGuard);
router.route('/get-guards/:parkingId').get( guardController.getGuardsByParkingId);
router.route('/update-guard/:guardId').put( guardController.updateGuard);
router.route('/get-guards-By-vendor-Id').get(decodeToken, guardController.getAllGuardsByVendorId);

router.route('/upload-guard-profile').post(guardAuthentication,upload.single('profileImage'), guardController.UploadGuardProfile);
router.route('/send-image/:image').get(guardController.sendProfile);

router.route('/changePassword').post(guardAuthentication, guardController.changePassword)

router.route('/forgot-password').post(guardController.forgotPassword);
router.route('/reset-password/:token').post(guardController.resetPasswordRedirect);
router.route('/reset-password').post(guardController.resetPassword);

module.exports = router