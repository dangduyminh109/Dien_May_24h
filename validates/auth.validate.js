module.exports = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        req.flash(
            "error",
            "Đăng nhập không thành công! Vui lòng nhập đầy đủ các thông tin cần thiết!"
        );
        res.redirect("back");
        return;
    }
    next();
};
