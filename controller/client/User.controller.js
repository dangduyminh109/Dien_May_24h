const User = require("../../models/user.model.js");

const getCategoryTree = require("../../helpers/get-category-tree.helper");

class UserController {
    async show(req, res) {
        const categoryTree = await getCategoryTree();
        const user = req.session.user || req.user || null;
        res.render("./client/page/user/", {
            pageTitle: "Điện Máy 24h",
            categoryTree,
            user,
        });
    }
}

module.exports = new UserController();
