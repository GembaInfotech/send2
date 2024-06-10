const ParkingSpace = require('../../models/parkingSpace.model')

exports.getParkingSpace = async (req, res) => {
  try {
    const parkingCode = req.params.Parkingcode;
    console.log(req.params);
    console.log(parkingCode);
    const parkingSpace = await ParkingSpace.find({parkingCode:parkingCode});
    console.log(parkingSpace);
    if (!parkingSpace) {
      return res.status(404).json({
        success: false,
        message: 'No Parking Space Added'
      });
    }
    
    res.status(200).json({
      success: true,
      data: parkingSpace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking Space',
      error: error.message
    });
  }
};
