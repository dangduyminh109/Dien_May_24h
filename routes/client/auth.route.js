const passport = require("passport");
const express = require("express");
const router = express.Router();
const AuthController = require("../../controller/client/Auth.controller");
const validate = require("../../validates/user.validate");

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);
router.get("/google/callback", AuthController.callbackGG);
router.get("/facebook/callback", AuthController.callbackFB);
router.get("/logout", AuthController.logout);

router.post("/register", validate.register, AuthController.register);
router.post("/verify", validate.verify, AuthController.verify);
router.post("/login", validate.login, AuthController.login);
router.post("/forgot", validate.forgot, AuthController.forgot);

module.exports = router;
