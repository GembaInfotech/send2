const {viewBookingList} = require("../handlers/bookingHandler/viewBookingList");
const {createBooking} = require('../handlers/bookingHandler/createBooking');
const {incomingBookingStatus} = require('../handlers/bookingHandler/incomingBookingStatus')
const {getBookingsByQuery} = require('../handlers/bookingHandler/getBookingsByQuery')
const {getIncomingBokingIn15Min} = require('../handlers/bookingHandler/getIncomingBokingIn15Min')
const {bookingStatus}  = require('../handlers/bookingHandler/bookingStatus')
const {exceedTimeAndExceedprice} = require('../handlers/bookingHandler/ExceedTimeAndExceedPrice')
const {getBookingByParkingId} = require('../handlers/bookingHandler/getBookingByParkingId')
const {viewBookingListPayout} = require('../handlers/bookingHandler/viewBookingListPayout')

exports.view_booking_list = async (req, res) => {
  try {
    await viewBookingList(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.view_booking_list_payout = async (req, res) => {
  try {
    await viewBookingListPayout(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create_new_booking = async (req, res) => {
    try {
      await createBooking(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.Incoming_booking_status= async (req, res) => {
    try {
      console.log("testing------34");
      await incomingBookingStatus(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  exports.get_booking_by_query= async (req, res) => {
    try {
      console.log("testing------34");
      await getBookingsByQuery(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }; 

  exports.get_incoming_booking_in_15min = async (req, res) => {
    try {
      console.log("testing------35");
      await  getIncomingBokingIn15Min(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }; 

  exports.booking_status= async (req, res) => {
    try {
      console.log("testing------34");
      await bookingStatus(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.get_booking_by_parkingId = async (req, res) => {
    try {
      console.log("testing------34");
      await getBookingByParkingId(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.exceed_time_and_exceed_price = async (req, res) => {
    try {
      console.log("testing------34");
      await exceedTimeAndExceedprice(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  
  


  
