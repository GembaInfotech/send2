const ParkingModel = require('../../models/parking.model')

exports.pending = async (req, res) => {
  console.log("heyy");
  const vendorId = req.query.vendor_id; 
  console.log("vendoridvendorid",vendorId);
  
  try {
    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID parameter is required'
      });
    }
    const parking = await ParkingModel.find({ vendor_id: vendorId, status: "pending" });
    res.status(200).json(parking);
  } catch (error) {
    console.error('Failed to fetch parking data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};

