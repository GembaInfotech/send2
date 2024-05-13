const ParkingModel = require('../../models/parking.model')

exports.updateParkingStatus = async (req, res) => {
    try {
      const vendor_id =req.userId;
      const {parking_id} = req.params;
      const { status } = req.body;
  
      // Check if the vendor ID is valid
      const isValidVendor = await ParkingModel.exists({ _id: parking_id, vendor_id: vendor_id });
      if (!isValidVendor) {
        return res.status(404).json({ success: false, message: 'Parking not found for the given vendor ID and parking ID' });
      }
  
      // Update the status of the parking
      const updatedParking = await ParkingModel.findByIdAndUpdate(parking_id, { status: status }, { new: true });
  
      if (!updatedParking) {
        return res.status(404).json({ success: false, message: 'Parking not found' });
      }
  
      res.status(200).json({ success: true, message: 'Parking status updated successfully', parking: updatedParking });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating parking status', error: error.message });
    }
  };
  