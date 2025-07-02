const system = require("../../config/system.js");
const User = require("../../models/user.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const {
    handleForm,
    generalHelper,
    filterAndSort,
} = require("../../helpers/user.helper.js");

class userController {
    // [GET] /admin/user
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listUser, pagination } = await filterAndSort(req.query);
        const handleData = req.session.backData || {};
        const general = await generalHelper();
        res.render("./admin/page/user/", {
            pageTitle: "Điện Máy 24h - Tài Khoản",
            PATH_ADMIN: system.PATH_ADMIN,
            currentPath,
            listUser,
            pagination,
            general,
            handle: handleData.formData,
            filter: req.query,
        });
    }

    // [GET] /admin/user/edit:id
    async edit(req, res) {
        const user = await User.findOne({
            _id: req.params.id,
        });
        res.render("./admin/page/user/edit", {
            pageTitle: "Edit user",
            PATH_ADMIN: system.PATH_ADMIN,
            user,
        });
    }

    // [GET] /admin/user/detail:id
    async detail(req, res) {
        try {
            const user = await User.findOne({
                _id: req.params.id,
            });
            res.render("./admin/page/user/detail", {
                pageTitle: "User detail",
                PATH_ADMIN: system.PATH_ADMIN,
                user,
            });
        } catch (error) {
            req.flash("error", "Có lỗi xảy ra!");
            console.error("Error:", error);
            res.redirect("/admin/user");
        }
    }

    // [PATCH] /admin/user/edit:id
    async editPatch(req, res) {
        try {
            const formData = await handleForm(req, true);
            await User.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa tài khoản thành công!");
            res.redirect("/admin/user");
        } catch (error) {
            console.error("Error saving user:", error);
            req.flash("error", "Sửa tài khoản không thành công!");
            res.redirect("/admin/user");
        }
    }

    // [PATCH] /admin/user/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await User.updateOne(
                { _id: statusUpdate._id },
                { status: statusUpdate.value }
            );
            res.json({ success: true, message: "Cập nhật thành công!" });
        } catch (error) {
            res.json({
                error: true,
                message: "Cập nhật không thành công!",
                err: error,
            });
        }
    }

    // [PATCH] /admin/user/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            req.session.backData = {
                formData: req.body,
            };
            await User.updateMany(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.flash("success", "Cập nhật khách hàng thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Cập nhật khách hàng không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/user/delete-account/:id
    async delete(req, res) {
        try {
            await User.delete({ _id: req.params.id });
            req.flash("success", "Xóa khách hàng thành công!");
            res.redirect("/admin/user");
        } catch (error) {
            console.error("Error saving user:", error);
            req.flash("error", "Xóa khách hàng không thành công!");
            res.redirect("/admin/user");
        }
    }

    // [DELETE] /admin/user/delete-more
    async deleteMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await User.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa khách hàng thành công!");
            res.redirect("/admin/user");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa khách hàng không thành công!");
            res.redirect("/admin/user");
        }
    }
}

module.exports = new userController();
