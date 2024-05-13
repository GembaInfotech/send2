'use strict';
const router = require("express").Router();
const paymentController = require("../controllers/payment.controller")


router.route("/hello").get(paymentController.sayHello);
router.route("/order").post(paymentController.order);
router.route("/order/validate").post(paymentController.validate);
router.route("/:id").post(paymentController.createPaymentLink);     



module.exports =router