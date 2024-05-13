const { createParking } = require('../handlers/parkingHandler/createParking');
const {viewParkingList} = require("../handlers/parkingHandler/viewParkingList")
const {updateParkingStatus} = require("../handlers/parkingHandler/updateParkingStatus")
const {getVendorParkings} = require("../handlers/parkingHandler/getVendorParkings")
const {updateParking} = require('../handlers/parkingHandler/updateParking')
const {getParkingByParkingId} = require('../handlers/parkingHandler/getParkingByParkingId')

exports.view_Parking_list = async (req, res) => {
  try {
    await viewParkingList(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.get_parking_by_parkingId = async (req, res) => {
  try {

    console.log("testing...2");
    await getParkingByParkingId(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.create_new_parking = async (req, res) => {
    try {
      await createParking(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.get_vendor_parkings = async (req, res) => {
    try {
      await getVendorParkings(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  exports.update_parking = async (req, res) => {
    try {
      await updateParking(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  
  exports.update_parking_status = async (req, res) => {
    try {
      await updateParkingStatus(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
  