'use strict';
const router = require("express").Router();
const invoiceController = require("../controllers/invoice.controler")

router.route('/create-invoice').post(invoiceController.create_invoice);
router.route('/getVoucher/:voucherNumber').get(invoiceController.get_voucher_by_voucher_no);

module.exports =router