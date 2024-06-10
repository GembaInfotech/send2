'use strict';
const router = require("express").Router();
  const parkingSpaceConrtoller = require('../controllers/parkingSpaceconrtoller')
  
  router.route('/getParkingSpace/:Parkingcode').get(parkingSpaceConrtoller.get_Parking_Space);
  router.route('/createParkingSpace/:Parkingcode').post(parkingSpaceConrtoller.create_Parking_Space);

  module.exports =router