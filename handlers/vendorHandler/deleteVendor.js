const VendorModel = require('../../models/vendor.model');

exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId; // Assuming vendorId is passed as a URL parameter
    console.log(vendorId);
    // Find the vendor by ID and delete it
    const deletedVendor = await VendorModel.findByIdAndDelete(vendorId);
    console.log(deletedVendor);

    if (!deletedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    console.log('Vendor deleted successfully');
    return res.status(200).json({ message: 'Vendor deleted successfully', deletedVendor });
  } catch (err) {
    console.error('Error deleting vendor:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
