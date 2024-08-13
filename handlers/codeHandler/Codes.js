const Code = require('../../models/code')

exports.generatevendorCode  = async()=>{
    const code  = await Code.findOneAndUpdate(
        {},  // Empty filter to match any document
        { $inc: { vendor: 1 } },  // Increment the currentCode by 1
        { new: true}    // Create the document if it doesn't exist
      ).select('vendor');
    
      // Format the code and assign it to the booking
      
      const codeNumber = code.vendor;
     const  vendorCode = `V${String(codeNumber).padStart(9, '0')}`;
return vendorCode;
}

exports.generateinvoiceCode = async () => {
  console.log("codeeeeeeeeeeeeeeeee");
  const code = await Code.findOneAndUpdate(
    {},  // Empty filter to match any document
    { $inc: { invoice: 1 } },  // Increment the currentCode by 1
    { new: true}    // Create the document if it doesn't exist
  ).select('invoice');
  
  const codeNumber = code.invoice;
  const invoiceCode = `INV${String(codeNumber).padStart(9, '0')}`;
  return invoiceCode;
};

exports.generatevoucherCode = async () => {
  console.log("codeeeeeeeeeeeeeeeee");
  const code = await Code.findOneAndUpdate(
    {},  // Empty filter to match any document
    { $inc: { voucher: 1 } },  // Increment the currentCode by 1
    { new: true}    // Create the document if it doesn't exist
  ).select('voucher');
  
  const codeNumber = code.voucher;
  const voucherCode = `VOU${String(codeNumber).padStart(9, '0')}`;
  return voucherCode;
};
exports.generateGaurdCode  = async()=>{
    const code  = await Code.findOneAndUpdate(
        {},  // Empty filter to match any document
        { $inc: { gaurd: 1 } },  // Increment the currentCode by 1
        { new: true}    // Create the document if it doesn't exist
      ).select('gaurd');
    
      // Format the code and assign it to the booking
      
      const codeNumber = code.gaurd;
     const  gaurdCode = `G${String(codeNumber).padStart(9, '0')}`;
return gaurdCode;
}
exports.generateParkingCode  = async()=>{
    const code  = await Code.findOneAndUpdate(
        {},  // Empty filter to match any document
        { $inc: { parking: 1 } },  // Increment the currentCode by 1
        { new: true}    // Create the document if it doesn't exist
      ).select('parking');
    
      // Format the code and assign it to the booking
      
      const codeNumber = code.parking;
     const  parkingCode = `P${String(codeNumber).padStart(9, '0')}`;
return parkingCode;
}