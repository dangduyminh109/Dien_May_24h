const md5 = require("md5");
const system = require("../../config/system.js");
const Account = require("../../models/account.model.js");

class roleController {
    // [GET] /admin/auth/login
    show(req, res) {
        res.render("./admin/page/auth/login.pug", {
            pageTitle: "Điện Máy 24h - Đăng nhập",
            PATH_ADMIN: system.PATH_ADMIN,
        });
    }

    // [GET] /admin/auth/logout
    logout(req, res) {
        res.clearCookie("token");
        req.flash("success", "Đăng xuất thành công!");
        return res.redirect("/admin/auth/login");
    }

    // [POST] /admin/auth/login
    async loginPost(req, res) {
        const account = await Account.findOne({ email: req.body.email });
        if (!account) {
            req.flash("error", "Tài khoản hoặc mật khẩu không hợp lệ!");
            return res.redirect("/admin/auth/login");
        } else if (account.password != md5(req.body.password)) {
            req.flash("error", "Tài khoản hoặc mật khẩu không hợp lệ!");
            return res.redirect("/admin/auth/login");
        } else if (account.status === "off") {
            req.flash("error", "Tài khoản đã bị khóa!");
            return res.redirect("/admin/auth/login");
        }
        res.cookie("token", account.token);
        req.flash("success", "Đăng nhập thành công!");
        res.redirect("/admin/product");
    }
}

module.exports = new roleController();
