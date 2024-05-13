const ParkingModel = require("../../models/parking.model")
exports.getVendorParkings = async (req, res) => {
    try {
      const vendor_id  = req.userId;
      console.log(vendor_id);
  
      // Find all parkings for the given vendor ID
      const parkings = await ParkingModel.find({ vendor_id: vendor_id });
      console.log(parkings);
  
      res.status(200).json({ success: true, message: 'Parkings retrieved successfully', parkings: parkings });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving parkings', error: error.message });
    }
  };
  