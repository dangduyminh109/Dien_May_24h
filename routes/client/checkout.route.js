const express = require("express");
const router = express.Router();
const CheckoutController = require("../../controller/client/Checkout.controller");

router.post("/cart", CheckoutController.cart);

router.post("/buy-now", CheckoutController.byNow);

module.exports = router;
