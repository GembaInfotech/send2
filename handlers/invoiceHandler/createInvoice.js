const BookingModel = require('../../models/booking.model');
const VendorModel = require('../../models/vendor.model');
const InvoiceModel = require('../../models/vendor_invoice.model');
const voucherModel = require('../../models/vendor_voucher.model')
const nodemailer = require('nodemailer');
const { generateinvoiceCode, generatevoucherCode } = require('../../handlers/codeHandler/Codes');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prashantrana9516@gmail.com',
    pass: 'qqjsatrjwvbynknu'
  }
});

exports.createInvoice = async (req, res) => {
  try {
    console.log(req.body);
    const { selectedBookingIds, vendorData, startDate, endDate } = req.body;
    console.log(selectedBookingIds);

    await BookingModel.updateMany(
      { _id: { $in: selectedBookingIds } },
      { $set: { is_invoice_generated: true } }
    );

    const vouchers = [];
    const invoices = [];

    for (const vendor of vendorData) {
      const vendorDetails = await VendorModel.findById(vendor.vendorId).exec();

      if (vendorDetails) {
        const invoiceId = await generateinvoiceCode();
        const voucherId = await generatevoucherCode();

        // Calculate total amount and total tax
        const amount = parseFloat(vendor.totalPrice) || 0;
        const total_Tax = parseFloat(vendor.totalGST) || 0;
        const totalAmount = amount + total_Tax;

        const voucher = {
          voucher_no: voucherId,
          voucher_date: new Date().toISOString().split('T')[0],
          from_date: startDate,
          to_date: endDate,
          total_payable_amount:vendor.totalPayementAmount,
          // unit_of: 'No.',
          // quantity: selectedBookingIds.length,
          // amount: amount.toFixed(2),  // Ensure to format to two decimal places
          // total_Tax: total_Tax.toFixed(2),  // Ensure to format to two decimal places
          // total_amount: totalAmount.toFixed(2),  // Ensure to format to two decimal places
          // description: `Invoice for vendor ${vendor.vendorName}`,
          vendor_id: vendor.vendorId,
          vendor_name: `${vendorDetails.firstName} ${vendorDetails.lastName}`,
          vendor_address: `${vendorDetails.billingAddress.address} ${vendorDetails.billingAddress.postalCode} ${vendorDetails.billingAddress.city} ${vendorDetails.billingAddress.state} ${vendorDetails.billingAddress.country}`,
          vendor_PAN: vendorDetails.panNo,
          vendor_gstIn: vendorDetails.gstNo,
          vendor_region: vendorDetails.region,
          // voucher_link: `http://localhost:5173/invoice#/invoice/${invoiceId}`
        };

        vouchers.push(voucher);
        await voucherModel.insertMany(vouchers);

        const invoice = {
          invoice_no: invoiceId,
          invoice_date: new Date().toISOString().split('T')[0],
          from_date: startDate,
          to_date: endDate,
          unit_of: 'No.',
          quantity: selectedBookingIds.length,
          amount: amount.toFixed(2),  // Ensure to format to two decimal places
          total_Tax: total_Tax.toFixed(2),  // Ensure to format to two decimal places
          total_amount: totalAmount.toFixed(2),  // Ensure to format to two decimal places
          description: `Invoice for vendor ${vendor.vendorName}`,
          vendor_id: vendor.vendorId,
          vendor_name: `${vendorDetails.firstName} ${vendorDetails.lastName}`,
          vendor_address: `${vendorDetails.billingAddress.address} ${vendorDetails.billingAddress.postalCode} ${vendorDetails.billingAddress.city} ${vendorDetails.billingAddress.state} ${vendorDetails.billingAddress.country}`,
          vendor_PAN: vendorDetails.panNo,
          vendor_gstIn: vendorDetails.gstNo,
          vendor_region: vendorDetails.region,
          invoice_link: `http://localhost:5173/invoice#/invoice/${invoiceId}`
        };

        invoices.push(invoice);

        const mailOptions = {
          from: 'prashantrana9516@gmail.com',
          to: 's.yadav@gembainfotech.com', // Assuming vendorDetails has an email field
          subject: 'Your Invoice',
          text: `Dear ${vendorDetails.firstName},\n\nYour invoice is ready for ${startDate} to ${endDate}. You can download it from the following link:\n\n${invoice.invoice_link}\n\nBest regards,\nYour Company`
        };

        await transporter.sendMail(mailOptions);
      }
    }

    await InvoiceModel.insertMany(invoices);

    res.status(200).json({ message: 'Invoices and vouchers created successfully', invoices });
  } catch (error) {
    console.error('Error creating invoices:', error);
    res.status(500).json({ message: 'Error creating invoices', error });
  }
};

