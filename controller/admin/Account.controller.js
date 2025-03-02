const system = require("../../config/system.js");
const Role = require("../../models/role.model.js");
const Account = require("../../models/account.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const {
    handleForm,
    generalHelper,
    filterAndSort,
} = require("../../helpers/account.helper.js");

class roleController {
    // [GET] /admin/accounts
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listAccounts, pagination } = await filterAndSort(req.query);
        const listRoles = await Role.find().select("name");
        const handle = req.session.backData || {};
        const general = await generalHelper();
        res.render("./admin/page/accounts/", {
            pageTitle: "Điện Máy 24h - Tài Khoản",
            PATH_ADMIN: system.PATH_ADMIN,
            currentPath,
            listAccounts,
            listRoles,
            pagination,
            general,
            handle,
            filter: req.query,
        });
    }

    // [GET] /admin/accounts/create
    async create(req, res) {
        const listRoles = await Role.find({});
        res.render("./admin/page/accounts/create", {
            pageTitle: "Create accounts",
            PATH_ADMIN: system.PATH_ADMIN,
            listRoles,
        });
    }

    // [GET] /admin/accounts/edit:id
    async edit(req, res) {
        const account = await Account.findOne({
            _id: req.params.id,
        });
        const listRoles = await Role.find({});
        res.render("./admin/page/accounts/edit", {
            pageTitle: "Edit account",
            PATH_ADMIN: system.PATH_ADMIN,
            account,
            listRoles,
        });
    }

    // [POST] /admin/accounts/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            const newAccount = new Account(formData);
            await newAccount.save();
            req.flash("success", "Tạo tài khoản thành công!");
            res.redirect("/admin/accounts");
        } catch (error) {
            req.flash("error", "Tạo tài khoản không thành công!");
            console.error("Error saving accounts:", error);
            res.redirect("/admin/accounts");
        }
    }

    // [PATCH] /admin/accounts/edit:id
    async editPatch(req, res) {
        try {
            const formData = await handleForm(req, true);
            await Account.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa tài khoản thành công!");
            res.redirect("/admin/accounts");
        } catch (error) {
            console.error("Error saving accounts:", error);
            req.flash("error", "Sửa tài khoản không thành công!");
            res.redirect("/admin/accounts");
        }
    }

    // [PATCH] /admin/accounts/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await Account.updateOne(
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

    // [PATCH] /admin/accounts/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await Account.updateMany(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.flash("success", "Cập nhật tài khoản thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Cập nhật tài khoản không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/accounts/delete-account/:id
    async delete(req, res) {
        try {
            await Account.delete({ _id: req.params.id });
            req.flash("success", "Xóa tài khoản thành công!");
            res.redirect("/admin/accounts");
        } catch (error) {
            console.error("Error saving accounts:", error);
            req.flash("error", "Xóa tài khoản không thành công!");
            res.redirect("/admin/accounts");
        }
    }

    // [DELETE] /admin/accounts/delete-more
    async deleteMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Account.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa tài khoản thành công!");
            res.redirect("/admin/accounts");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa tài khoản không thành công!");
            res.redirect("/admin/accounts");
        }
    }
}

module.exports = new roleController();
