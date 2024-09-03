
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



