const VendorModel = require('../../models/vendor.model');

exports.updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId; 
    const updateFields = req.body;

    // Find the vendor by ID and update their information
    const vendor = await VendorModel.findByIdAndUpdate(vendorId, updateFields, { new: true });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    console.log('Vendor updated successfully');
    return res.status(200).json({ message: 'Vendor updated successfully', vendor });
  } catch (err) {
    console.error('Error updating vendor:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
