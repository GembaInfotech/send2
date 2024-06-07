'use strict';
const router = require("express").Router();
const guardController = require('../controllers/guard.controller')
const decodeToken = require("../middlewares/auth/decodeToken");


router.route('/create-new-guard/:parkingid').post(decodeToken,guardController.addGuard);
router.route('/guard-login').post( guardController.signin);
router.route('/get-guard/:guardId').get( guardController.getGuard);
router.route('/get-guards/:parkingId').get( guardController.getGuardsByParkingId);
router.route('/update-guard/:guardId').put( guardController.updateGuard);
router.route('/get-guards-By-vendor-Id').get(decodeToken, guardController.getAllGuardsByVendorId);


module.exports =router