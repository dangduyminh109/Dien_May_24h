const system = require("../../config/system.js");
var navMenu = [
    {
        name: "Dashboard",
        child: [{ name: "Setting" }, { name: "Profile" }],
    },
    {
        name: "Reports",
        child: [{ name: "Sales" }, { name: "Revenue" }],
    },
    {
        name: "Users",
    },
];
class dashboardController {
    show(req, res) {
        res.render("./admin/page/dashboard/", {
            pageTitle: "Điện Máy 24h - admin",
            PATH_ADMIN: system.PATH_ADMIN,
            navMenu,
        });
    }
}

module.exports = new dashboardController();
