const system = require("../../config/system.js");
const Role = require("../../models/role.model.js");
class profileController {
    async show(req, res) {
        const role = await Role.findOne({ _id: res.locals.user.roleId }).select(
            "name"
        );
        res.render("./admin/page/profile/", {
            pageTitle: "profile",
            PATH_ADMIN: system.PATH_ADMIN,
            user: res.locals.user,
            role: role.name,
        });
    }
}

module.exports = new profileController();
