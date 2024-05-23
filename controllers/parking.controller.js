const { createParking } = require('../handlers/parkingHandler/createParking');
const {viewParkingList} = require("../handlers/parkingHandler/viewParkingList")
const {updateParkingStatus} = require("../handlers/parkingHandler/updateParkingStatus")
const {getVendorParkings} = require("../handlers/parkingHandler/getVendorParkings")
const {updateParking} = require('../handlers/parkingHandler/updateParking')
const {getParkingByParkingId} = require('../handlers/parkingHandler/getParkingByParkingId')
const {getParkingByGuardId} = require('../handlers/parkingHandler/getParkingByGuardId')
// const getParkingByParkingId 
const {approve}  = require('../handlers/parkingHandler/approve')
const { pending} = require('../handlers/parkingHandler/pendingHandler')

exports.view_Parking_list = async (req, res) => {
  try {
    await viewParkingList(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.approve = async (req, res) => {
  try {
    await approve(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.get_parking_by_parkingId = async (req, res) => {
  try {

    // console.log("testing...2");
    await getParkingByParkingId(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.pending = async(req,res) =>{
  try{
    await pending(req,res);
  }
  catch(err)
  {
    res.status(500).json(err)
  }
}


exports.get_parking_by_guardId = async (req, res) => {
  try {

    console.log("testing...2");
    await getParkingByGuardId(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.create_new_parking = async (req, res) => {
    try {
      console.log("testing...123");
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
      console.log("testing45.....");
      await updateParking(req, res);
    } catch (error) {
      console.log("testoing...23");
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

  
  