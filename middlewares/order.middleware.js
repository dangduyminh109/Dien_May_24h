const Product = require("../models/product.model.js");
const Voucher = require("../models/voucher.model.js");
const Order = require("../models/order.model.js");
const { TotalPriceAndDiscount } = require("../helpers/checkout.helper.js");

module.exports = async function orderMiddleware(req, res, next) {
    try {
        const user = req.session.user || req.user || null;
        const formData = req.body;
        if (user) {
            formData.user = user._id;
        }
        if (formData.paymentMethod == "BANK") {
            // đơn hàng tự động xóa sau 7h nếu không thanh toán
            const expiresAt = new Date(Date.now() + 7 * 60 * 60 * 1000);
            formData.expiresAt = expiresAt;
        }
        const listProductId = formData.product.map((item) => item.productId);
        const listProduct = await Product.find({
            _id: { $in: listProductId },
        });

        const productData = listProduct.map((item) => {
            return {
                product: item,
                quantity: formData.product.find(
                    (product) => product.productId == item._id
                ).quantity,
            };
        });
        let voucher = null;
        if (formData.voucher != "" && user) {
            const vc = await Voucher.findById(formData.voucher);
            if (
                !vc.usedBy.some((id) => id.toString() === user._id.toString())
            ) {
                vc.usedBy = [...vc.usedBy, user._id];
                vc.save();
                voucher = vc;
            }
        }
        const totalPriceAndDiscount = TotalPriceAndDiscount(
            productData,
            voucher
        );
        formData.totalAmount =
            totalPriceAndDiscount.totalPrice - totalPriceAndDiscount.discount;
        const newOrder = new Order(formData);
        await newOrder.save();
        let redirect = "/checkout/status";
        if (formData.paymentMethod == "BANK") {
            req.body = {
                orderId: newOrder._id,
                amount: newOrder.totalAmount,
                bankCode: "",
                orderDescription: `Thanh toán đơn hàng ${newOrder._id}`,
                orderType: "billpayment",
            };
            next();
        } else {
            res.json({
                success: true,
                message: "Đặt hàng thành công!",
                redirect,
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            error: true,
            message: "Đặt hàng không thành công! Có Lỗi xảy ra!",
            err,
        });
    }
};
