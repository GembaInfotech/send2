'use strict';
const router = require("express").Router();
const passport = require("passport");
const { uploadPhoto, parkingImgResize } = require("../middlewares/ImageUpload/upload");
const uploadParkingImages = require('../utils/UploadImage/uploadParkingImages')

const decodeToken = require("../middlewares/auth/decodeToken");

  const parkingController = require("../controllers/parking.controller")
  router.route('/create-new-parking').post(decodeToken, parkingController.create_new_parking);
  router.route('/get-vendor-parkings').get( decodeToken , parkingController.get_vendor_parkings);
  router.route('/search').get(parkingController.view_Parking_list);
  router.route('/getParking/:parking_id').get(parkingController.get_parking_by_parkingId);
  
  router.route('/add-new-image').post(uploadParkingImages, parkingController.upload);
  router.route('/send-parking-image/:image').get(parkingController.send_parking_images);

  router.route('/update-parking/:parking_id').put(decodeToken, parkingController.update_parking);
  router.route('/getvendorsParkings/:vendor_id').get(parkingController.get_parkings_by_vendorId);

  router.route('/getguardParking/:guard_id').get(parkingController.get_parking_by_guardId);
  router.route('/getParkingByVendorIdAndStatus?').get(parkingController.get_arking_by_vendorId_and_status);
  router.route('/approve/:id').put( parkingController.approve);

  router.route('/getAllParkings').get(parkingController.get_all_parkings);


  

  module.exports =router