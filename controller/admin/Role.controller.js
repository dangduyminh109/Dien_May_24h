const system = require("../../config/system.js");
const Role = require("../../models/role.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const { roleHelper } = require("../../helpers/role.helper.js");

class roleController {
    // [GET] /admin/roles
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listRoles, pagination } = await roleHelper(req);
        res.render("./admin/page/roles/", {
            pageTitle: "Điện Máy 24h - Nhóm Quyền",
            PATH_ADMIN: system.PATH_ADMIN,
            currentPath,
            listRoles,
            pagination,
            filter: req.query,
        });
    }

    // [GET] /admin/roles/create
    async create(req, res) {
        res.render("./admin/page/roles/create", {
            pageTitle: "Create roles",
            PATH_ADMIN: system.PATH_ADMIN,
        });
    }

    // [GET] /admin/roles/edit:id
    async edit(req, res) {
        const roles = await Role.findOne({
            _id: req.params.id,
        });
        res.render("./admin/page/roles/edit", {
            pageTitle: "Edit roles",
            PATH_ADMIN: system.PATH_ADMIN,
            roles,
        });
    }

    // [GET] /admin/roles/permissions
    async showPermissions(req, res) {
        const { listRoles } = await roleHelper(req);
        res.render("./admin/page/roles/permission", {
            pageTitle: "Điện Máy 24h - Phân Quyền",
            PATH_ADMIN: system.PATH_ADMIN,
            listRoles,
        });
    }

    // [GET] /admin/role/detail:id
    async detail(req, res) {
        const roles = await Role.findOne({
            _id: req.params.id,
        });

        res.render("./admin/page/roles/detail", {
            pageTitle: "Role detail",
            PATH_ADMIN: system.PATH_ADMIN,
            roles,
        });
    }

    // [POST] /admin/roles/create
    async createPost(req, res) {
        try {
            const newRoles = new Role(req.body);
            await newRoles.save();
            req.flash("success", "Tạo quyền mới thành công!");
            res.redirect("/admin/roles");
        } catch (error) {
            req.flash("error", "Tạo quyền mới không thành công!");
            console.error("Error saving role:", error);
            res.redirect("/admin/roles");
        }
    }

    // [PATCH] /admin/roles/edit:id
    async editPatch(req, res) {
        try {
            const formData = req.body;
            await Role.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa quyền thành công!");
            res.redirect("/admin/roles");
        } catch (error) {
            console.error("Error saving roles:", error);
            req.flash("error", "Sửa quyền không thành công!");
            res.redirect("/admin/roles");
        }
    }

    // [PATCH] /admin/roles/permissions/update
    async permissionUpdate(req, res) {
        try {
            const formData = req.body;
            for (const item in formData) {
                const permission = JSON.parse(formData[item]);
                await Role.updateOne(
                    { _id: item },
                    { $set: { permission: permission } }
                );
            }
            req.flash("success", "Thiết lập phân quyền thành công!");
            res.redirect("/admin/roles/permissions");
        } catch (error) {
            console.error("Error saving Permissions:", error);
            req.flash("error", "Thiết lập phân quyền không thành công!");
            res.redirect("/admin/roles/permissions");
        }
    }

    // [DELETE] /admin/roles/delete-roles/:id
    async delete(req, res) {
        try {
            await Role.delete({ _id: req.params.id });
            req.flash("success", "Xóa quyền thành công!");
            res.redirect("/admin/roles");
        } catch (error) {
            console.error("Error saving roles:", error);
            req.flash("error", "Xóa quyền không thành công!");
            res.redirect("/admin/roles");
        }
    }

    // [DELETE] /admin/roles/delete-more
    async deleteMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Role.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa quyền thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa quyền không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new roleController();
