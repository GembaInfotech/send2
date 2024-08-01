const {createInvoice} = require('../handlers/invoiceHandler/createInvoice')
const {getInvoiceByInvoiceNo} = require('../handlers/invoiceHandler/getInvoiceByInvoiceNo')
exports.create_invoice = async (req, res) => {
  try {
    console.log("testing...123I");
    await createInvoice(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.get_invoice_by_invoice_no = async (req, res) => {
    try {
      console.log("testing...123I");
      await getInvoiceByInvoiceNo(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };


