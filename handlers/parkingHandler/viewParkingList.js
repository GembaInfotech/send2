
const ParkingModel = require('../../models/parking.model')

exports.viewParkingList = async (req, res) => {
  try {
    const {latitude} = req.query
    const {longitude} =req.query
    console.log("testing...1");
    console.log(req.query)
    const parkings = await ParkingModel.find({
        location: {
           $near: {
              $geometry: {
                 type: "Point",
                 coordinates: [   longitude ,latitude ]
              },
              $maxDistance : 8000
           }
        }
     });
    console.log("testing...2",parkings);
    res.status(200).json({
      success: true,
      data: parkings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};
