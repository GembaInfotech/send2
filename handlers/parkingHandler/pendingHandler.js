const ParkingModel = require('../../models/parking.model')
const VendorModel = require('../../models/vendor.model')

exports.pending = async (req, res) => {
  try {
    const parking = await ParkingModel.find({status:"pending"}).populate("vendor_id");
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
        
    res.status(200).json(parking);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};
