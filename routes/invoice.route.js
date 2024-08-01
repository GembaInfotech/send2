'use strict';
const router = require("express").Router();
const invoiceController = require("../controllers/invoice.controler")
// const decodeToken = require("../middlewares/auth/decodeToken");

router.route('/create-invoice').post(invoiceController.create_invoice);
router.route('/getInvoice/:invoiceNumber').get(invoiceController.get_invoice_by_invoice_no);





module.exports =router