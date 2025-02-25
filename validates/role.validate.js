module.exports = (req, res, next) => {
    const isUpdating = req.method === "PUT" || req.method === "PATCH";
    if (!req.body.name) {
        req.flash(
            "error",
            isUpdating
                ? "Cập nhật quyền không thành công! Vui lòng nhập đầy đủ các thông tin cần thiết!"
                : "Tạo quyền không thành công! Vui lòng nhập đầy đủ các thông tin cần thiết!"
        );
        res.redirect("back");
        return;
    }
    next();
};
