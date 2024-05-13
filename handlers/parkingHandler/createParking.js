const ParkingModel = require("../../models/parking.model")

exports.createParking = async (req, res) => {
    try {
      // console.log("testing....1");
      // console.log(req.userId);
      // console.log(req.body.ParkingData);
      let parkingData = req.body.ParkingData;
      parkingData["vendor_id"] = req.userId;
      parkingData.vendorId = req.userId;


      // console.log(parkingData);
      const newParking = new ParkingModel(parkingData);
      // console.log("newParking", newParking);
     try{
      const savedParking = await newParking.save();
      // console.log("savedParking", savedParking);
     }
     catch(Err)
     {
      console.log(Err)
     }
      res.status(201).json({ success: true, message: 'Parking created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating parking', error: error.message });
    }
  };