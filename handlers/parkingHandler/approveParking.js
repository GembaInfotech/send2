const ParkingModel = require('../../models/parking.model')
// const VendorModel = require('../../models/vendor.model')

exports.approve = async (req, res) => {
  try {
    const {id} =req.params;
    const {status } = req.query
    console.log(req.params);
    console.log("staus for approval", req.query)
    console.log("staus for approval 2", status)
    const parking = await ParkingModel.findById(id)
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking not found'
      });
    }
    console.log("check")
  try{
    parking.status= status
    await parking.save();
  }
  catch(err){
    console.log(err)
  }
    console.log("check")

        
    res.status(200).json( { success:true});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};
