const User = require("../../models/user.model.js");
const { uploadSingleImages } = require("../../helpers/upload.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper");

class UserController {
    async show(req, res) {
        const categoryTree = await getCategoryTree();
        const user = req.session.user || req.user || null;
        res.render("./client/page/user/", {
            pageTitle: "Điện Máy 24h",
            categoryTree,
            user,
            cart: req.session.cart || [],
        });
    }

    async edit(req, res) {
        const categoryTree = await getCategoryTree();
        const user = req.session.user || req.user || null;
        res.render("./client/page/user/edit", {
            pageTitle: "Điện Máy 24h",
            categoryTree,
            user,
            cart: req.session.cart || [],
        });
    }

    // [POST] /admin/products/edit:id
    async editPost(req, res) {
        try {
            const url = await uploadSingleImages(req.file);
            const formData = req.body;
            const sessionUser = req.session.user || req.user || null;
            if (sessionUser) {
                formData.avatar = url || sessionUser.avatar;
                await User.updateOne({ _id: sessionUser._id }, formData);
                req.flash("success", "Cập nhật thành công!");
            } else {
                req.flash("error", "Cập nhật không thành công!");
            }
            res.redirect("/user/profile");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Cập nhật không thành công!");
            res.redirect("/user/edit-profile");
        }
    }
}

module.exports = new UserController();
