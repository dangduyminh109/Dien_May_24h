const system = require("../../config/system.js");
const Voucher = require("../../models/voucher.model.js");
const {
    filterAndSort,
    generalHelper,
    handleForm,
} = require("../../helpers/voucher.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");

class voucherController {
    // [GET] /admin/voucher
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listVoucher, pagination } = await filterAndSort(req);
        const handleData = req.session.backData || {};
        const general = await generalHelper();
        res.render("./admin/page/voucher", {
            pageTitle: "Voucher",
            PATH_ADMIN: system.PATH_ADMIN,
            listVoucher,
            general,
            filter: req.query,
            handle: handleData.formData,
            pagination,
            currentPath,
        });
    }

    // [GET] /admin/voucher/create
    async create(req, res) {
        res.render("./admin/page/voucher/create", {
            pageTitle: "Create voucher",
            PATH_ADMIN: system.PATH_ADMIN,
        });
    }

    // [GET] /admin/voucher/edit/:id
    async edit(req, res) {
        const voucher = await Voucher.findOne({
            _id: req.params.id,
        });
        res.render("./admin/page/voucher/edit", {
            pageTitle: "Edit Voucher",
            PATH_ADMIN: system.PATH_ADMIN,
            voucher,
        });
    }

    // [GET] /admin/voucher/detail:id
    async detail(req, res) {
        const voucher = await Voucher.findOne({
            _id: req.params.id,
        });
        res.render("./admin/page/voucher/detail", {
            pageTitle: "voucher detail",
            PATH_ADMIN: system.PATH_ADMIN,
            voucher,
        });
    }

    // [POST] /admin/voucher/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            const newVoucher = new Voucher(formData);
            await newVoucher.save();
            req.flash("success", "Tạo voucher thành công!");
            res.redirect("/admin/voucher");
        } catch (error) {
            req.flash("error", "Tạo voucher không thành công!");
            console.error("Error saving product:", error);
            res.redirect("/admin/voucher");
        }
    }

    // [PATCH] /admin/voucher/edit:id
    async editPatch(req, res) {
        try {
            const formData = await handleForm(req, true);
            await Voucher.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa voucher thành công!");
            res.redirect("/admin/voucher");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Sửa voucher không thành công!");
            res.redirect("/admin/voucher");
        }
    }

    // [PATCH] /admin/voucher/update-discountValue
    async quickUpdate(req, res) {
        const dataUpdate = req.body;
        try {
            await Voucher.updateOne(
                { _id: dataUpdate._id },
                { [dataUpdate.field]: parseInt(dataUpdate.value) }
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

    // [PATCH] /admin/voucher/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await Voucher.updateOne(
                { _id: statusUpdate._id },
                { status: statusUpdate.value == "on" ? true : false }
            );
            res.json({
                success: true,
                message: "Cập nhật thành công!",
            });
        } catch (error) {
            res.json({
                error: true,
                message: "Cập nhật không thành công!",
                err: error,
            });
        }
    }

    // [PATCH] /admin/voucher/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            if (dataUpdate.status) {
                dataUpdate.status = dataUpdate.status == "on" ? true : false;
            }
            await Voucher.updateMany(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.session.backData = {
                formData: req.body,
            };
            req.flash("success", "Cập nhật voucher thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Cập nhật voucher không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/voucher/delete-voucher/:id
    async delete(req, res) {
        try {
            await Voucher.delete({ _id: req.params.id });
            req.flash("success", "Xóa voucher thành công!");
            res.redirect("/admin/voucher");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa voucher không thành công!");
            res.redirect("/admin/voucher");
        }
    }

    // [DELETE] /admin/voucher/delete-more
    async deleteMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);

        try {
            await Voucher.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa voucher thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa voucher không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new voucherController();
