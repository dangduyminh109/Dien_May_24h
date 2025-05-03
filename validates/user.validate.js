const { validationResult, body } = require("express-validator");

const register = [
    body("name").notEmpty().withMessage("Tên người dùng không được để trống!"),
    body("confirm").notEmpty().withMessage("mã xác nhận không được để trống!"),
    body("email").isEmail().withMessage("Email không hợp lệ!"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Mật khẩu phải có ít nhất 8 ký tự"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            req.flash("openModal", true);
            res.redirect("/");
        } else {
            next();
        }
    },
];

const login = [
    body("email").isEmail().withMessage("Email không hợp lệ!"),
    body("password").notEmpty().withMessage("Mật khẩu không được để trống!"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            req.flash("openModal", true);
            res.redirect("/");
        } else {
            next();
        }
    },
];

const verify = [
    body("email").isEmail().withMessage("Email không hợp lệ!"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({
                error: true,
                message: errors.array()[0].msg,
            });
        } else {
            next();
        }
    },
];

const forgot = [
    body("confirm").notEmpty().withMessage("mã xác nhận không được để trống!"),
    body("email").isEmail().withMessage("Email không hợp lệ!"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Mật khẩu phải có ít nhất 8 ký tự"),
    body("passwordConfirm")
        .notEmpty()
        .withMessage("Mật khẩu xác nhận không được để trống!"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", errors.array()[0].msg);
            req.flash("openModal", true);
            res.redirect("/");
        } else {
            next();
        }
    },
];

module.exports = {
    login,
    register,
    verify,
    forgot,
};
