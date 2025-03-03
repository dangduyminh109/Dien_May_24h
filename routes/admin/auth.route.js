const express = require("express");
const router = express.Router();

const authController = require("../../controller/admin/Auth.controller");
const validate = require("../../validates/auth.validate");

router.get("/login", authController.show);
router.get("/logout", authController.logout);

router.post("/login", validate, authController.loginPost);

module.exports = router;
