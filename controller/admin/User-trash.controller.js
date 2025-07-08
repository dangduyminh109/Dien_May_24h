const system = require("../../config/system.js");
const User = require("../../models/user.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const {
    generalHelper,
    filterAndSort,
} = require("../../helpers/user.helper.js");
class userTrashController {
    // [GET] /admin/user-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listUser, pagination } = await filterAndSort(req, true);
        const handleData = req.session.backData || {};
        const general = await generalHelper(true);
        res.render("./admin/page/user/user-trash", {
            pageTitle: "User trash",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedUser: listUser,
            general,
            handle: handleData.formData,
            filter: req.query,
            pagination,
            currentPath,
        });
    }
    // [GET] /admin/user-trash/detail:id
    async detail(req, res) {
        try {
            const user = await User.findOneDeleted({
                _id: req.params.id,
            });
            res.render("./admin/page/user/detail", {
                pageTitle: "User detail",
                PATH_ADMIN: system.PATH_ADMIN,
                user,
                deleted: true,
            });
        } catch (error) {
            req.flash("error", "Có lỗi xảy ra!");
            console.error("Error:", error);
            res.redirect("/admin/user");
        }
    }

    // [PATCH] /admin/user-trash/restore-user
    async restore(req, res) {
        try {
            await User.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục tài khoản thành công!");
            res.redirect("/admin/user-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục tài khoản không thành công!");
            res.redirect("/admin/user-trash");
        }
    }

    // [PATCH] /admin/user-trash/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await User.updateManyDeleted(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.session.backData = {
                formData: req.body,
            };
            req.flash("success", "Cập nhật tài khoản thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Cập nhật tài khoản không thành công!");
            res.redirect("back");
        }
    }

    // [PATCH] /admin/user-trash/restore-more
    async restoreMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await User.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục tài khoản thành công!");
            res.redirect("/admin/user-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục tài khoản không thành công!");
            res.redirect("/admin/user-trash");
        }
    }

    // [PATCH] /admin/user-trash/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await User.updateOneDeleted(
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

    // [DELETE] /admin/user-trash/destroy-user/:id
    async destroy(req, res) {
        try {
            await User.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa tài khoản thành công!");
            res.redirect("/admin/user-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa tài khoản không thành công!");
            res.redirect("/admin/user-trash");
        }
    }

    // [DELETE] /admin/user-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await User.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa tài khoản thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa tài khoản không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new userTrashController();
