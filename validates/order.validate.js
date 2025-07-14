const { validationResult, body } = require("express-validator");

const order = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Họ tên không được để trống!"),
    body("address")
        .trim()
        .notEmpty()
        .withMessage("Địa chỉ không được để trống!"),
    body("email")
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage("Email không hợp lệ!"),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Số điện thoại không được để trống!")
        .matches(/^0\d{9}$/)
        .withMessage("Số điện thoại không hợp lệ!"),
    body("paymentMethod")
        .notEmpty()
        .withMessage("Bạn phải chọn phương thức thanh toán!")
        .isIn(["COD", "BANK"])
        .withMessage("Phương thức thanh toán không hợp lệ!"),
    body("product")
        .isArray({ min: 1 })
        .withMessage("Danh sách sản phẩm không hợp lệ!"),
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

module.exports = {
    order,
};
