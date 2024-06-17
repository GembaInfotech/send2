const ParkingModel = require("../../models/parking.model");
const ParkingSpace = require('../../models/parkingSpace.model')
const { generateParkingCode } = require("../codeHandler/Codes");

exports.createParking = async (req, res) => {
  try {


    // let parkingData = req.body.ParkingData;
    let parkingData = req.body.ParkingData;
    console.log(req.body.ParkingData);
    let twoWheelerCapacity = req.body.ParkingData.twoWheelerCapacity
    let fourWheelerCapacity = req.body.ParkingData.fourWheelerCapacity
    console.log(twoWheelerCapacity, fourWheelerCapacity);

    parkingData["vendor_id"] = req.userId;
    parkingData.vendorId = req.userId;

    const newParking = new ParkingModel(parkingData);

    try {
      const savedParking = await newParking.save();
      const code = await generateParkingCode();
      savedParking.code = code;
      await savedParking.save();

      for (let i = 1; i <= twoWheelerCapacity; i++) {
        const space = new ParkingSpace({spaceId: `TWP${i}`, vehicletype: 'twoWheeler',parkingCode:code });
        await space.save();
      }
    
      // Create four-wheeler spaces
      for (let i = 1; i <= fourWheelerCapacity; i++) {
        const space = new ParkingSpace({ spaceId: `FWP${i}`, vehicletype: 'fourWheeler', parkingCode:code });
        await space.save();
      }

    }
    catch (Err) {
      console.log(Err)
    }
    res.status(201).json({ success: true, message: 'Parking created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating parking', error: error.message });
  }
};