module.exports = (req, res, next) => {
    const isUpdating = req.method === "PUT" || req.method === "PATCH";
    if (!req.body.name || !req.body.code || !req.body.price) {
        req.flash(
            "error",
            isUpdating
                ? "Cập nhật sản phẩm không thành công! Vui lòng nhập đầy đủ các thông tin cần thiết!"
                : "Tạo sản phẩm không thành công! Vui lòng nhập đầy đủ các thông tin cần thiết!"
        );
        res.redirect("back");
        return;
    }
    next();
};
