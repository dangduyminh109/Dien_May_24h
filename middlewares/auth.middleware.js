const Account = require("../models/account.model");
const Role = require("../models/role.model");

module.exports = async function authMiddleware(req, res, next) {
    if (!req.cookies.token) return res.redirect("/admin/auth/login");

    const account = await Account.findOne({ token: req.cookies.token }).select(
        "-password"
    );
    if (!account) return res.redirect("/admin/auth/login");

    res.locals.user = account;
    const userRole = await Role.findOne({ _id: account.roleId }).select(
        "permission"
    );
    res.locals.permission = userRole.permission;
    next();
};
