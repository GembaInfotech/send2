const VendorModel = require('../../models/vendor.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await VendorModel.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, vendor.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error logging in vendor:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
