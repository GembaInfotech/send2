'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorVoucherSchema = new Schema(
  {
    voucher_no: {
      type: String,
      required: true,
    },
    voucher_date: {
      type: String,
      required: true,
    },
    voucher_link:{
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
    total_payable_amount: {
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

module.exports = mongoose.model('VendorVoucher', VendorVoucherSchema);
