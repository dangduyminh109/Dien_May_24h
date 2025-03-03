const Account = require("../models/account.model");

module.exports = async function authMiddleware(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect("/admin/auth/login");
    } else {
        const account = await Account.findOne({ token: req.cookies.token });
        if (!account) {
            return res.redirect("/admin/auth/login");
        } else {
            next();
        }
    }
};
