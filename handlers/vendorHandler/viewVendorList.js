const VendorModel = require('../../models/vendor.model');

exports.viewVendorList = async (req, res) => {
  try {
    const vendors = await VendorModel.find();

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ message: 'No vendors found' });
    }

    console.log('Vendors retrieved successfully');
    return res.status(200).json({ vendors });
  } catch (err) {
    console.error('Error fetching vendors:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
