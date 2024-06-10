const ParkingSpace = require('../../models/parkingSpace.model')

exports.createParkingSpace = async (req, res) => {
  try {
    const parkingCode = req.params.Parkingcode;

    console.log(parkingCode);
    let twoWheelerCapacity = req.body.twoWheelerCapacity
    let fourWheelerCapacity = req.body.fourWheelerCapacity

    for (let i = 1; i <= twoWheelerCapacity; i++) {
        const space = new ParkingSpace({spaceId: `TWP${i}`, vehicletype: 'twoWheeler',parkingCode:parkingCode });
        await space.save();
      }
    
      // Create four-wheeler spaces
      for (let i = 1; i <= fourWheelerCapacity; i++) {
        const space = new ParkingSpace({ spaceId: `FWP${i}`, vehicletype: 'fourWheeler', parkingCode:parkingCode });
        await space.save();
      }
    
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create parking Space',
      error: error.message
    });
  }
};
