'use strict';
const router = require("express").Router();

  const bookingController = require("../controllers/booking.controller")
  const decodeToken = require("../middlewares/auth/decodeToken");

  router.route('/view-booking-list').get(decodeToken, bookingController.view_booking_list);
  router.route('/get-booking-by-query').get(bookingController.get_booking_by_query);
  // router.route('/get-incoming-booking-in-15min').get(bookingController.get_incoming_booking_in_15min);
  router.route('/get-incoming-booking-in-15min/:parkingId').get(bookingController.get_incoming_booking_in_15min);

  router.route('/create-new-booking').post(bookingController.create_new_booking); 
  router.route('/exceed-time-and-exceed-price/:bookingId').put(bookingController.exceed_time_and_exceed_price);
  router.route('/booking-status/:bookingId').put(bookingController.booking_status);
  router.route('/getBookingsByParkingId').get(bookingController.get_booking_by_parkingId);

  router.route('/incoming-booking-status').put(decodeToken, bookingController.Incoming_booking_status);
  // router.route('/create-new-booking').post(decodeToken,bookingController.create_new_booking);

  // router.route('/update-booking').put(decodeToken,bookingController.update_booking);
  module.exports =router