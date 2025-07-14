const system = require("../../config/system.js");
const Order = require("../../models/order.model.js");
const Voucher = require("../../models/voucher.model.js");
const {
    filterAndSort,
    generalHelper,
    handleForm,
} = require("../../helpers/order.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");

class orderController {
    // [GET] /admin/order
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listOrder, pagination } = await filterAndSort(req);
        const handleData = req.session.backData || {};
        const general = await generalHelper();
        res.render("./admin/page/order", {
            pageTitle: "Order",
            PATH_ADMIN: system.PATH_ADMIN,
            listOrder,
            general,
            filter: req.query,
            handle: handleData.formData,
            pagination,
            currentPath,
        });
    }

    // [GET] /admin/order/edit/:id
    async edit(req, res) {
        const order = await Order.findOne({
            _id: req.params.id,
        })
            .populate("user", "name")
            .populate("voucher")
            .populate("product.productId");
        const listVoucher = await Voucher.aggregate([
            {
                $addFields: {
                    usedCount: { $size: "$usedBy" },
                },
            },
            {
                $match: {
                    status: "on",
                },
            },
        ]);
        res.render("./admin/page/order/edit", {
            pageTitle: "Edit Order",
            PATH_ADMIN: system.PATH_ADMIN,
            order,
            listVoucher,
        });
    }

    // [GET] /admin/order/detail:id
    async detail(req, res) {
        const order = await Order.findOne({
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

    // [PATCH] /admin/order/edit:id
    async editPatch(req, res) {
        try {
            const formData = handleForm(req);
            await Order.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa order thành công!");
            res.redirect("/admin/order");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Sửa order không thành công!");
            res.redirect("/admin/order");
        }
    }

    // [PATCH] /admin/order/update-status
    async updateStatusPatch(req, res) {
        const PaidUpdate = req.body;
        try {
            await Order.updateOne(
                { _id: PaidUpdate._id },
                { isPaid: PaidUpdate.value === "on" }
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

    // [PATCH] /admin/order/update-more
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
            await Order.updateMany(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.session.backData = {
                formData: req.body,
            };
            req.flash("success", "Cập nhật đơn hàng thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Cập nhật đơn hàng không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/order/delete-order/:id
    async delete(req, res) {
        try {
            await Order.delete({ _id: req.params.id });
            req.flash("success", "Xóa đơn hàng thành công!");
            res.redirect("/admin/order");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa đơn hàng không thành công!");
            res.redirect("/admin/order");
        }
    }

    // [DELETE] /admin/order/delete-more
    async deleteMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await Order.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa đơn hàng thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa đơn hàng không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new orderController();
