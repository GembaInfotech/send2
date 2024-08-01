'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorInvoiceSchema = new Schema(
  {
    invoice_no: {
      type: String,
      required: true,
    },
    invoice_date: {
      type: String,
      required: true,
    },
    invoice_link:{
        type: String,
    },
    from_date: {
      type: String,
      required: true,
    },
    to_date: {
      type: String,
      required: true,
    },
    unit_of: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
    },
    total_amount: {
      type: String,
    },
    description: {
      type: String,
    },
    vendor_id: {
      type: String,
      required: true,
    },
    vendor_name: {
      type: String,
    },
    vendor_address: {
      type: String,
    },
    vendor_PAN: {
      type: String,
    },
    vendor_gstIn: {
      type: String,
    },
    vendor_region: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VendorInvoice', VendorInvoiceSchema);
