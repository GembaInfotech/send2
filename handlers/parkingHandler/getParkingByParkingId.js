const ParkingModel = require('../../models/parking.model')

exports.getParkingByParkingId = async (req, res) => {
  try {
    const {parking_id} = req.params;
    const parking = await ParkingModel.findOne({_id:parking_id});
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
