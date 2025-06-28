const system = require("../../config/system.js");
const Role = require("../../models/role.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const { roleHelper } = require("../../helpers/role.helper.js");

class roleTrashController {
    // [GET] /admin/roles-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listRoles, pagination } = await roleHelper(req.query, true);
        const handle = req.session.backData || {};
        res.render("./admin/page/roles/role-trash", {
            pageTitle: "Roles Trash",
            PATH_ADMIN: system.PATH_ADMIN,
            currentPath,
            listRoles,
            filter: req.query,
            handle,
            pagination,
        });
    }
    // [GET] /admin/role-trash/detail:id
    async detail(req, res) {
        try {
            const roles = await Role.findOneDeleted({
                _id: req.params.id,
            });

            res.render("./admin/page/roles/detail", {
                pageTitle: "Role detail",
                PATH_ADMIN: system.PATH_ADMIN,
                roles,
                deleted: true,
            });
        } catch (error) {
            req.flash("error", "Có lỗi xảy ra!");
            console.error("Error:", error);
            res.redirect("/admin/accounts");
        }
    }

    // [PATCH] /admin/roles-trash/restore-roles
    async restore(req, res) {
        try {
            await Role.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục quyền thành công!");
            res.redirect("/admin/roles-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục quyền không thành công!");
            res.redirect("/admin/roles-trash");
        }
    }

    // [PATCH] /admin/roles-trash/restore-more
    async restoreMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await Role.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi quyền mục thành công!");
            res.redirect("/admin/roles-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi quyền mục không thành công!");
            res.redirect("/admin/roles-trash");
        }
    }

    // [DELETE] /admin/roles-trash/destroy-roles/:id
    async destroy(req, res) {
        try {
            await Role.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa quyền thành công!");
            res.redirect("/admin/roles-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa quyền không thành công!");
            res.redirect("/admin/roles-trash");
        }
    }

    // [DELETE] /admin/roles-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Role.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa quyền thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa quyền không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new roleTrashController();
