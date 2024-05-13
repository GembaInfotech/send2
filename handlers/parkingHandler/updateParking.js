const ParkingModel = require("../../models/parking.model")

exports.updateParking = async (req, res) => {
    try {
        console.log(req.body, req.params, req.userId);
        const vendor_id = req.userId
      const {parking_id} = req.params;
      console.log(vendor_id, parking_id);

      const parkingDataToUpdate = req.body;
  
      // Check if the vendor ID is valid
      const isValidVendor = await ParkingModel.exists({ _id: parking_id, vendor_id: vendor_id });
      console.log(isValidVendor);
      if (!isValidVendor) {
        return res.status(404).json({ success: false, message: 'Parking not found for the given vendor ID and parking ID' });
      }
  
      // Update the parking
      const updatedParking = await ParkingModel.findByIdAndUpdate(parking_id, parkingDataToUpdate, { new: true });
      console.log(updatedParking);
  
      if (!updatedParking) {
        return res.status(404).json({ success: false, message: 'Parking not found' });
      }
  
      res.status(200).json({ success: true, message: 'Parking updated successfully', parking: updatedParking });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating parking', error: error.message });
    }
  };
  