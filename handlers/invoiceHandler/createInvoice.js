const BookingModel = require('../../models/booking.model');
const VendorModel = require('../../models/vendor.model');
const InvoiceModel = require('../../models/vendor_invoice.model');
const voucherModel = require('../../models/vendor_voucher.model')
const nodemailer = require('nodemailer');
const { generateinvoiceCode, generatevoucherCode } = require('../../handlers/codeHandler/Codes');
const {sendVerificationEmail} = require('../../utils/nodemailer.js')
const {InvoiceCreationTemplate} = require ('../../emailTemplate/InvoiceCreation.js')
const fs = require('fs');
const path = require('path');

const { generateInvoicePDF } = require('../../controllers/pdfController'); 

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
        };

        const invoiceVendor = {
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
        };

        const pdfBuffer = await generateInvoicePDF(invoiceVendor);
        const invoicesDir = path.join(__dirname, '../../invoices'); 
        if (!fs.existsSync(invoicesDir)) {
          fs.mkdirSync(invoicesDir, { recursive: true });
        }
    
        // Save the PDF file on the server
        const pdfPath = path.join(invoicesDir, `invoice_${invoiceVendor.invoice_no}.pdf`);
        fs.writeFileSync(pdfPath, pdfBuffer);
    
        // Send the download link back to the frontend
        const downloadLink = `http://localhost:3456/invoices/invoice_${invoiceVendor.invoice_no}.pdf`;

        invoices.push(invoice);


        const customizedTemplate = InvoiceCreationTemplate
        .replace('%NAME%', vendorDetails.firstName)
        .replace('%FROM%', startDate)
        .replace('%TO%', endDate)
        .replace('%LINK%', downloadLink);
              sendVerificationEmail(vendorDetails, customizedTemplate);
      }
    }

    await InvoiceModel.insertMany(invoices);

    res.status(200).json({ message: 'Invoices and vouchers created successfully', invoices });
  } catch (error) {
    console.error('Error creating invoices:', error);
    res.status(500).json({ message: 'Error creating invoices', error });
  }
};

