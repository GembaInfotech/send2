const ParkingModel = require("../../models/parking.model")
const upload  = require('../../middlewares/ImageUpload/upload');

exports.upload = async (req, res) => {
    try {
        // console.log(req.body, req.params, req.userId);
        const {id} = req.body;



  
      // Check if the vendor ID is valid
      const isValidVendor = await ParkingModel.exists({ _id: id });
      console.log(isValidVendor);
      if (!isValidVendor) {
        return res.status(404).json({ success: false, message: 'Parking not found for the given vendor ID and parking ID' });
      }
  
      // Update the parking
      const updatedParking = await ParkingModel.findByIdAndUpdate(id, 
        { $push: { image : req?.imagepath.url } }

        , { new: true });
      console.log(updatedParking);
  
      if (!updatedParking) {
        return res.status(404).json({ success: false, message: 'Parking not found' });
      }
  
      res.status(200).json({ success: true, message: 'Parking updated successfully', parking: updatedParking });
    } catch (error) {
        console.log(error)
      res.status(500).json({ success: false, message: 'Error updating parking', error: error.message });
    }
  };
  