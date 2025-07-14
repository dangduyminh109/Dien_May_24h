const User = require("../../models/user.model.js");
const Order = require("../../models/order.model.js");
const { uploadSingleImages } = require("../../helpers/upload.helper.js");
const { TotalPriceAndDiscount } = require("../../helpers/checkout.helper.js");
class UserController {
    async show(req, res) {
        res.render("./client/page/user/", {
            pageTitle: "Điện Máy 24h",
        });
    }

    async edit(req, res) {
        res.render("./client/page/user/edit", {
            pageTitle: "Điện Máy 24h",
        });
    }

    // [POST] /admin/products/edit:id
    async editPost(req, res) {
        try {
            const url = await uploadSingleImages(req.file);
            const formData = req.body;
            const sessionUser = req.session.user || req.user || null;
            if (sessionUser) {
                formData.avatar = url || sessionUser.avatar;
                await User.updateOne({ _id: sessionUser._id }, formData);
                req.flash("success", "Cập nhật thành công!");
            } else {
                req.flash("error", "Cập nhật không thành công!");
            }
            res.redirect("/user/profile");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Cập nhật không thành công!");
            res.redirect("/user/edit-profile");
        }
    }

    async orders(req, res) {
        const sessionUser = req.session.user || req.user || null;
        let orders = [];
        if (sessionUser) {
            orders = await Order.find({
                user: sessionUser._id,
            })
                .populate("voucher")
                .populate("product.productId");
        }
        orders.forEach((order) => {
            let listProduct = order.product.map((item) => {
                return {
                    product: item.productId,
                    quantity: item.quantity,
                };
            });
            order.TotalPriceAndDiscount = TotalPriceAndDiscount(
                listProduct,
                order.voucher
            );
        });
        res.render("./client/page/user/orders", {
            pageTitle: "Điện Máy 24h",
            orders,
        });
    }
}

module.exports = new UserController();
