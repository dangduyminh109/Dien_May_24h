module.exports = (req, res, next) => {
    const isUpdating = req.method === "PUT" || req.method === "PATCH";
    if (
        !req.body.name ||
        !req.body.code ||
        !req.body.discountValue ||
        !req.body.discountType ||
        !req.body.startDate
    ) {
        req.flash(
            "error",
            isUpdating
                ? "Cập nhật sản phẩm không thành công! Vui lòng nhập đầy đủ các thông tin cần thiết!"
                : "Tạo sản phẩm không thành công! Vui lòng nhập đầy đủ các thông tin cần thiết!"
        );
        res.redirect("back");
        return;
    }
    if (req.body.expiredAt && req.body.expiredAt <= req.body.startDate) {
        req.flash(
            "error",
            isUpdating
                ? "Cập nhật sản phẩm không thành công! Ngày hết hạn phải lớn hơn ngày bắt đầu!"
                : "Tạo sản phẩm không thành công! Ngày hết hạn phải lớn hơn ngày bắt đầu!"
        );
        res.redirect("back");
        return;
    }

    if (
        req.body.discountType == "percent" &&
        (parseInt(req.body.discountValue) < 0 ||
            parseInt(req.body.discountValue) > 100)
    ) {
        req.flash(
            "error",
            isUpdating
                ? "Cập nhật sản phẩm không thành công! Giá trị giảm phải nằm trong khoảng 1 đến 100(%) cho kiểu giảm theo phần trăm!"
                : "Tạo sản phẩm không thành công! Giá trị giảm phải nằm trong khoảng 1 đến 100(%) cho kiểu giảm theo phần trăm!"
        );
        res.redirect("back");
        return;
    }
    next();
};
