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
    amount:{
      type:String,
      require:true
    },
    total_amount: {
      type: String,
    },
    total_Tax:{
      type:String,
      require:true
    },
    description: {
      type: String,
    },
    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: 'VendorModel',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VendorInvoice', VendorInvoiceSchema);
