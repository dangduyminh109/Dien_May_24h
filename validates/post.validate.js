const { validationResult, body } = require("express-validator");
const allowedStatuses = ["public", "draft", "hidden"];

const post = [
    body("title").trim().notEmpty().withMessage("Tiêu đề không được để trống!"),
    body("content")
        .trim()
        .notEmpty()
        .withMessage("Nội dung không được để trống!"),
    body("status")
        .trim()
        .notEmpty()
        .withMessage("Trạng thái không được để trống!")
        .custom((value) => {
            if (!allowedStatuses.includes(value)) {
                throw new Error("Trạng thái không hợp lệ!");
            }
            return true;
        }),
    (req, res, next) => {
        const isUpdating = req.method === "PUT" || req.method === "PATCH";
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash(
                "error",
                isUpdating
                    ? `Cập nhật danh mục không thành công! ${errors.array()[0].msg}!`
                    : `Tạo danh mục không thành công! ${errors.array()[0].msg}!`
            );
            res.redirect("back");
            return;
        } else {
            next();
        }
    },
];

module.exports = {
    post,
};
