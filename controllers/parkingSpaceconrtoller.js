// const { createParking } = require('../handlers/parkingHandler/createParking');
// const {viewParkingList} = require("../handlers/parkingHandler/viewParkingList")
// const {updateParkingStatus} = require("../handlers/parkingHandler/updateParkingStatus")
// const {getVendorParkings} = require("../handlers/parkingHandler/getVendorParkings")
// const {updateParking} = require('../handlers/parkingHandler/updateParking')
// const {getParkingByParkingId} = require('../handlers/parkingHandler/getParkingByParkingId')
// const {getParkingByGuardId} = require('../handlers/parkingHandler/getParkingByGuardId')
// const {approve}  = require('../handlers/parkingHandler/approve')
// const { pending} = require('../handlers/parkingHandler/pendingHandler')

const {getParkingSpace} = require('../handlers/parkingSpaceHandler/getParkingSpace')
const {createParkingSpace} = require('../handlers/parkingSpaceHandler/createParkingSpace')
exports.get_Parking_Space = async (req, res) => {
  try {
    await getParkingSpace(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create_Parking_Space = async (req, res) => {
    try {
      await createParkingSpace(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };



