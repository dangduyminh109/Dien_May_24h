const system = require("../../config/system.js");
const Voucher = require("../../models/voucher.model.js");
const {
    filterAndSort,
    generalHelper,
} = require("../../helpers/voucher.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
class voucherTrashController {
    // [GET] /admin/voucher-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listVoucher, pagination } = await filterAndSort(
            req.query,
            true
        );
        const handle = req.session.backData || {};
        const general = await generalHelper(true);
        res.render("./admin/page/voucher/voucher-trash", {
            pageTitle: "Voucher Trash",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedVoucher: listVoucher,
            general,
            filter: req.query,
            handle,
            pagination,
            currentPath,
        });
    }

    // [GET] /admin/voucher-trash/detail:id
    async detail(req, res) {
        const voucher = await Voucher.findOneDeleted({
            _id: req.params.id,
        });
        res.render("./admin/page/voucher/detail", {
            pageTitle: "Voucher detail",
            PATH_ADMIN: system.PATH_ADMIN,
            voucher,
            deleted: true,
        });
    }

    // [PATCH] /admin/voucher-trash/restore
    async restore(req, res) {
        try {
            await Voucher.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục sản phẩm thành công!");
            res.redirect("/admin/voucher-trash");
        } catch (error) {
            console.error("Error saving voucher:", error);
            req.flash("error", "Khôi phục sản phẩm không thành công!");
            res.redirect("/admin/voucher-trash");
        }
    }

    // [PATCH] /admin/voucher-trash/update-status
    async updateStatusPatch(req, res) {
        const statusUpdate = req.body;
        try {
            await Voucher.updateOneDeleted(
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

    // [PATCH] /admin/voucher-trash/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await Voucher.updateManyDeleted(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.session.backData = {
                formData: req.body,
            };
            req.flash("success", "Câp nhật sản phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving voucher:", error);
            req.flash("error", "Câp nhật sản phẩm không thành công!");
            res.redirect("back");
        }
    }

    // [PATCH] /admin/voucher-trash/restore-more
    async restoreMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Voucher.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục sản phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving voucher:", error);
            req.flash("error", "Khôi phục sản phẩm không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/voucher-trash/destroy-voucher/:id
    async destroy(req, res) {
        try {
            await Voucher.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa sản phẩm thành công!");
            res.redirect("/admin/voucher-trash");
        } catch (error) {
            console.error("Error saving voucher:", error);
            req.flash("error", "Xóa sản phẩm không thành công!");
            res.redirect("/admin/voucher-trash");
        }
    }

    // [DELETE] /admin/voucher-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Voucher.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa sản phẩm thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving voucher:", error);
            req.flash("error", "Xóa sản phẩm không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new voucherTrashController();
