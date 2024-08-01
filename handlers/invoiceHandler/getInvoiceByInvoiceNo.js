const InvoiceModel = require('../../models/vendor_invoice.model')

exports.getInvoiceByInvoiceNo = async (req, res) => {
    try {
      const { invoiceNumber } = req.params;
      const invoice = await InvoiceModel.findOne({ invoice_no: invoiceNumber }).exec();
  
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
  
      res.status(200).json({ message: 'Invoice retrieved successfully', invoice });
    } catch (error) {
      console.error('Error retrieving invoice:', error);
      res.status(500).json({ message: 'Error retrieving invoice', error });
    }
  };