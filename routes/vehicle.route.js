'use strict';
const router = require("express").Router();
const passport = require("passport");

const decodeToken = require("../middlewares/auth/decodeToken");
const requireAuth = passport.authenticate("jwt", { session: false }, null);

const vehicleController = require('../controllers/vehicle.controller')

router.route('/create-new-vehicle').post( decodeToken,  vehicleController.create_new_vehicle);

  router.route('update-vehicle/:vehicleId').put( vehicleController.update_vehicle);

  router.route('set-vehicle-default/:vehicleId').put( vehicleController.set_vehicle_default);

  router.route('/view-vehicle-list').get(decodeToken, vehicleController.view_vehicle_list);

  router.route('delete-vehicle/:vehicleId').delete( vehicleController.delete_vehicle);



module.exports =router