const ParkingModel = require('../../models/parking.model')

exports.getParkingByParkingId = async (req, res) => {
  try {
    console.log("testing...1");
    const {parkingId} = req.params; // Assuming the parking ID is passed in the URL params
    const parking = await ParkingModel.findOne({_id:parkingId});
    console.log(parking);
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: parking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};
