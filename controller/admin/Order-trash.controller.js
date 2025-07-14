const system = require("../../config/system.js");
const Order = require("../../models/order.model.js");
const {
    filterAndSort,
    generalHelper,
} = require("../../helpers/order.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
class orderTrashController {
    // [GET] /admin/order-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listOrder, pagination } = await filterAndSort(req, true);
        const handle = req.session.backData || {};
        const general = await generalHelper(true);
        res.render("./admin/page/order/order-trash", {
            pageTitle: "Order Trash",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedOrder: listOrder,
            general,
            filter: req.query,
            handle,
            pagination,
            currentPath,
        });
    }

    // [GET] /admin/order-trash/detail:id
    async detail(req, res) {
        const order = await Order.findOneDeleted({
            _id: req.params.id,
        })
            .populate("user", "name")
            .populate("voucher", "code")
            .populate("product.productId");
        res.render("./admin/page/order/detail", {
            pageTitle: "order detail",
            PATH_ADMIN: system.PATH_ADMIN,
            order,
        });
    }

    // [PATCH] /admin/order-trash/restore
    async restore(req, res) {
        try {
            await Order.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục đơn hàng thành công!");
            res.redirect("/admin/order-trash");
        } catch (error) {
            console.error("Error saving order:", error);
            req.flash("error", "Khôi phục đơn hàng không thành công!");
            res.redirect("/admin/order-trash");
        }
    }

    // [PATCH] /admin/order-trash/update-status
    async updateStatusPatch(req, res) {
        const PaidUpdate = req.body;
        try {
            await Order.updateOneDeleted(
                { _id: PaidUpdate._id },
                { isPaid: PaidUpdate.value === "on" }
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

    // [PATCH] /admin/order-trash/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            if (dataUpdate.isPaid && dataUpdate.isPaid === "on") {
                dataUpdate.isPaid = true;
            } else if (dataUpdate.isPaid && dataUpdate.isPaid === "off") {
                dataUpdate.isPaid = false;
            }
            await Order.updateManyDeleted(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.session.backData = {
                formData: req.body,
            };
            req.flash("success", "Câp nhật đơn hàng thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving order:", error);
            req.flash("error", "Câp nhật đơn hàng không thành công!");
            res.redirect("back");
        }
    }

    // [PATCH] /admin/order-trash/restore-more
    async restoreMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Order.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục đơn hàng thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving order:", error);
            req.flash("error", "Khôi phục đơn hàng không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/order-trash/destroy-order/:id
    async destroy(req, res) {
        try {
            await Order.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa đơn hàng thành công!");
            res.redirect("/admin/order-trash");
        } catch (error) {
            console.error("Error saving order:", error);
            req.flash("error", "Xóa đơn hàng không thành công!");
            res.redirect("/admin/order-trash");
        }
    }

    // [DELETE] /admin/order-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Order.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa đơn hàng thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving order:", error);
            req.flash("error", "Xóa đơn hàng không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new orderTrashController();
