const system = require("../../config/system.js");
const Role = require("../../models/role.model.js");
const Account = require("../../models/account.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const {
    generalHelper,
    filterAndSort,
} = require("../../helpers/account.helper.js");
class AccountTrashController {
    // [GET] /admin/account-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listAccounts, pagination } = await filterAndSort(
            req.query,
            true
        );
        const listRoles = await Role.find().select("name");
        const handle = req.session.backData || {};
        const general = await generalHelper(true);
        res.render("./admin/page/accounts/account-trash", {
            pageTitle: "Account trash",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedAccounts: listAccounts,
            general,
            listRoles,
            handle,
            filter: req.query,
            pagination,
            currentPath,
        });
    }
    // [GET] /admin/accounts/detail:id
    async detail(req, res) {
        try {
            const account = await Account.findOneDeleted({
                _id: req.params.id,
            });
            const role = await Role.findOne({ _id: account.roleId });
            res.render("./admin/page/accounts/detail", {
                pageTitle: "Account detail",
                PATH_ADMIN: system.PATH_ADMIN,
                account,
                role,
                deleted: true,
            });
        } catch (error) {
            req.flash("error", "Có lỗi sảy ra!");
            console.error("Error:", error);
            res.redirect("/admin/accounts");
        }
    }

    // [PATCH] /admin/accounts-trash/restore-account
    async restore(req, res) {
        try {
            await Account.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục tài khoản thành công!");
            res.redirect("/admin/accounts-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục tài khoản không thành công!");
            res.redirect("/admin/accounts-trash");
        }
    }

    // [PATCH] /admin/accounts-trash/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await Account.updateManyDeleted(
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

    // [PATCH] /admin/accounts-trash/restore-more
    async restoreMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await Account.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục tài khoản thành công!");
            res.redirect("/admin/accounts-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục tài khoản không thành công!");
            res.redirect("/admin/accounts-trash");
        }
    }

    // [PATCH] /admin/accounts-trash/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await Account.updateOneDeleted(
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

    // [DELETE] /admin/accounts-trash/destroy-account/:id
    async destroy(req, res) {
        try {
            await Account.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa tài khoản thành công!");
            res.redirect("/admin/accounts-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa tài khoản không thành công!");
            res.redirect("/admin/accounts-trash");
        }
    }

    // [DELETE] /admin/accounts-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Account.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa tài khoản thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa tài khoản không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new AccountTrashController();
