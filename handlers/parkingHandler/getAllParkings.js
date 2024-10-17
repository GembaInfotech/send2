const ParkingModel = require('../../models/parking.model');

exports.getAllParkings = async (req, res) => {
  try {
    
    const parkingList = await ParkingModel.find().select('name code');

    res.status(200).json({
      success: true,
      data: parkingList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};
