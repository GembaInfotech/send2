const ParkingModel = require('../../models/parking.model')
const {sendVerificationEmail} = require('../../utils/nodemailer.js')
const {ParkingApprovalTemplate} = require('../../emailTemplate/ParkingApproval.js')

exports.pending = async (req, res) => {
  console.log("heyy");
  const vendorId = req.query.vendor_id; 
  console.log("vendoridvendorid",vendorId);
  
  try {
    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID parameter is required'
      });
    }
    const parking = await ParkingModel.find({ vendor_id: vendorId
      // , status: "pending" 
    }).populate({
      path: 'vendor',
      model: 'VendorModel',
      select: 'firstName lastName communicationAddress.email',
    })
    .exec();

    const customizedTemplate = ParkingApprovalTemplate
    .replace('%NAME%', parking.vendor.firstName)
    .replace('%PARKING_NAME%', parking.name)
    .replace('%PARKING_ADDRESS%', parking.address_line1)
    .replace('%VALIDITY_FROM%', parking.validity_FromDate)
    .replace('%VALIDITY_TO%', parking.validity_ToDate);
            sendVerificationEmail(parking.vendor, customizedTemplate);
    res.status(200).json(parking);
  } catch (error) {
    console.error('Failed to fetch parking data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
};

