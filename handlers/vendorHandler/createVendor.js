const Code = require('../../models/code');
const VendorModel = require('../../models/vendor.model');
const bcrypt = require('bcrypt');

exports.createVendor = async (req, res) => {
  try {
    // const {
    //   firstName,
    //   lastName,
    //   contact,
    //   email,
    //   password,
    //   pincode,
    //   address,
    //   city,
    //   state,
    //   country
    // } = req.body;

  v

    const code  = await Code.findOneAndUpdate(
      {},  // Empty filter to match any document
      { $inc: { currentCode: 1 } },  // Increment the currentCode by 1
      { new: true}    // Create the document if it doesn't exist
    );

    // Format the code and assign it to the booking
    const codeNumber = codeDoc.currentCode;
   const  vendorCode = `V${String(codeNumber).padStart(9, '0')}`;
  console.log(vendorCode)

    // const vendor = new VendorModel({
    //   code : vendorCode,
    //   firstName: firstName.toUpperCase(),
    //   lastName: lastName.toUpperCase(),
    //   contact: contact,
    //   email: email.toLowerCase(),
    //   password: hashedPassword, 
    //   pincode: pincode,
    //   address: address,
    //   city: city,
    //   state: state,
    //   country: country,
    //   createdOnDate: new Date().toISOString(), 
    //   acceptedTerms: false, 
    //   vendorStatus: 'Pending',
    //   vendorActive: false, 
    // });

    // await vendor.save();
    console.log('Vendor created successfully');
    return res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (err) {
    console.error('Error creating vendor:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
