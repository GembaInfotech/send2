const ParkingModel = require('../../models/parking.model');

exports.getParkingByVendorIdAndStatus = async (req, res) => {
  
  const vendorId = req.query.vendor_id; 
  const status = req.query.status; 
  
  try {
    const query = {};
    if (vendorId) {
      query.vendor_id = vendorId; 
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID parameter is required'
      });
    }
    if (status) {
      query.status = status; 
    }
    const parking = await ParkingModel.find(query).populate('vendor_id', 'code firstName lastName email');  
    // console.log("parking", parking)
    res.status(200).json({
      success: true,
      data: parking,
    });
  } catch (error) {
    console.error('Failed to fetch parking data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};
