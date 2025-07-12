const User = require("../../models/user.model.js");
const Product = require("../../models/product.model.js");
const Order = require("../../models/order.model.js");
const {
    TotalPriceAndDiscount,
    getListVoucher,
} = require("../../helpers/checkout.helper.js");
const {
    buildVnpParams,
    handleVnPayReturnData,
    generateVnpUrl,
} = require("../../helpers/vnPay.helper.js");
const moment = require("moment");
class CheckoutController {
    async cart(req, res) {
        const sessionUser = req.session.user || req.user || null;
        let user = null;
        let cart = req.session.cart || [];
        if (sessionUser) {
            user = await User.findById(sessionUser._id).populate(
                "cart.productId"
            );
            cart = user.cart.map((item) => {
                return {
                    product: item.productId,
                    quantity: item.quantity,
                };
            });
        } else {
            if (cart.length > 0) {
                const listId = cart.map((item) => item.productId);
                const listProduct = await Product.find({
                    _id: { $in: listId },
                });
                cart = cart.map((item) => {
                    item.product = listProduct.find(
                        (product) => product._id == item.productId
                    );
                    return item;
                });
            }
        }
        // voucher
        let listVoucher = [];
        if (user) {
            listVoucher = await getListVoucher(user);
        }
        let voucher = null;
        if (req.body.vc && req.body.vc != "") {
            voucher = listVoucher.find((item) => item._id == req.body.vc);
        }
        const totalPriceAndDiscount = TotalPriceAndDiscount(cart, voucher);
        res.render("./client/page/checkout/", {
            pageTitle: "Điện Máy 24h",
            user,
            listItemCart: cart,
            voucher,
            note: req.body.note,
            listVoucher,
            totalPriceAndDiscount,
        });
    }
    async byNow(req, res) {
        const sessionUser = req.session.user || req.user || null;
        let user = null;
        // user
        if (sessionUser) {
            user = await User.findById(sessionUser._id).populate(
                "cart.productId"
            );
        }
        // slug
        const product = await Product.findById(req.body.productId);
        const quantity = parseInt(req.body.quantity) || 1;
        const cart = [
            {
                product,
                quantity,
            },
        ];
        // voucher
        let listVoucher = [];
        if (user) {
            listVoucher = await getListVoucher(user);
        }
        const totalPriceAndDiscount = TotalPriceAndDiscount(cart);

        res.render("./client/page/checkout/", {
            pageTitle: "Điện Máy 24h",
            user,
            listItemCart: cart,
            listVoucher,
            totalPriceAndDiscount,
        });
    }

    async status(req, res) {
        res.render("./client/page/checkout/status", {
            pageTitle: "Đặt hàng thành công",
            status: "success",
            message:
                "Đặt hàng thành công! Đơn hàng sẽ được giao tới bạn trong thời gian sớm nhất.",
        });
    }

    async vnPay(req, res) {
        try {
            process.env.TZ = "Asia/Ho_Chi_Minh";
            var ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const { amount, bankCode, orderDescription, orderType } = req.body;
            let vnp_Params = buildVnpParams({
                amount,
                orderDescription,
                orderType,
                bankCode,
                ipAddr,
            });

            // lưu thông tin vào database để cập nhật đơn hàng khi thanh toán thành công
            const order = await Order.findById(req.body.orderId);
            order.transactionRef = vnp_Params.vnp_TxnRef;
            await order.save();

            const vnpUrl = generateVnpUrl(vnp_Params);
            res.json({ redirect: vnpUrl });
        } catch (error) {
            console.log(err);
            res.json({
                error: true,
                message: "Đặt hàng không thành công! Có Lỗi xảy ra!",
                err,
            });
        }
    }

    async vnPayReturn(req, res) {
        try {
            const { vnp_Params, secureHash, signed } =
                handleVnPayReturnData(req);
            const order = await Order.findOne({
                transactionRef: vnp_Params["vnp_TxnRef"],
            });
            if (
                secureHash === signed &&
                vnp_Params["vnp_ResponseCode"] == "00"
            ) {
                order.isPaid = true;
                order.expiresAt = null;
                order.paidAt = moment(
                    vnp_Params["vnp_PayDate"],
                    "YYYYMMDDHHmmss"
                ).toDate();
                await order.save();
                res.render("./client/page/checkout/status", {
                    pageTitle: "Đặt hàng thành công",
                    status: "success",
                    message:
                        "Thanh toán thành công! Đơn hàng sẽ được giao tới bạn trong thời gian sớm nhất",
                });
            } else {
                let message = `Thanh toán không thành công, vui lòng thanh toán trước ${moment(
                    order.expiresAt
                ).format("HH:mm DD/MM/YYYY")}`;
                res.render("./client/page/checkout/status", {
                    pageTitle: "Đặt hàng không thành công",
                    status: "error",
                    message,
                });
            }
        } catch (err) {
            console.log(err);
            let message =
                "Có lỗi xảy ra trong quá trình mua hàng, vui lòng thử lại sau!";
            res.render("./client/page/checkout/status", {
                pageTitle: "Đặt hàng không thành công",
                status: "error",
                message,
            });
        }
    }
}

module.exports = new CheckoutController();
