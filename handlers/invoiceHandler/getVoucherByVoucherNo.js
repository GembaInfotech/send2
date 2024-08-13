const voucherModel = require('../../models/vendor_voucher.model')

exports.getVoucherByVoucherNo = async (req, res) => {
    try {
      const { voucherNumber } = req.params;
      const voucher = await voucherModel.findOne({ voucher_no: voucherNumber }).exec();
  
      if (!voucher) {
        return res.status(404).json({ message: 'Voucher not found' });
      }
  
      res.status(200).json({ message: 'Voucher retrieved successfully', voucher });
    } catch (error) {
      console.error('Error retrieving voucher:', error);
      res.status(500).json({ message: 'Error retrieving voucher', error });
    }
  };