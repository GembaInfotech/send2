const ParkingModel = require('../../models/parking.model')
// const VendorModel = require('../../models/vendor.model')
const {sendVerificationEmail} = require('../../utils/nodemailer.js')
const {ParkingApprovalTemplate} = require('../../emailTemplate/ParkingApproval.js')

exports.approve = async (req, res) => {
  try {
    const {id} =req.params;
    const {status } = req.query
    console.log(req.params);
    console.log("staus for approval", req.query)
    console.log("staus for approval 2", status)
    const parking = await ParkingModel.findById(id).populate('vendor_id', 'code firstName lastName email')
    
        const customizedTemplate = ParkingApprovalTemplate
    .replace('%NAME%', parking.vendor_id.firstName)
    .replace('%PARKING_NAME%', parking.name)
    .replace('%PARKING_ADDRESS%', parking.address_line1)
    .replace('%VALIDITY_FROM%', parking.validity_FromDate)
    .replace('%VALIDITY_TO%', parking.validity_ToDate);
            sendVerificationEmail(parking.vendor_id, customizedTemplate);
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
