const express = require("express");
const router = express.Router();
const CheckoutController = require("../../controller/client/Checkout.controller");
const validate = require("../../validates/order.validate");
const orderMiddleware = require("../../middlewares/order.middleware");

router.get("/status", CheckoutController.status);

router.post("/cart", CheckoutController.cart);

router.post("/buy-now", CheckoutController.byNow);

router.post(
    "/order",
    validate.order,
    orderMiddleware,
    CheckoutController.vnPay
);

router.get("/vnPay_return", CheckoutController.vnPayReturn);

module.exports = router;
