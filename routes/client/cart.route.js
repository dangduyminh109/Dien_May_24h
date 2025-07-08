const express = require("express");
const router = express.Router();
const CartController = require("../../controller/client/Cart.controller");

router.get("/", CartController.show);

router.get("/delete/:id", CartController.delete);

router.post("/add", CartController.add);

router.patch("/update", CartController.update);

module.exports = router;
