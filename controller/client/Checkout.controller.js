const User = require("../../models/user.model.js");
const Product = require("../../models/product.model.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
const {
    TotalPriceAndDiscount,
    getListVoucher,
} = require("../../helpers/checkout.helper.js");
class CheckoutController {
    async cart(req, res) {
        const categoryTree = await getCategoryTree();
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
            categoryTree,
            user,
            listItemCart: cart,
            voucher,
            listVoucher,
            totalPriceAndDiscount,
        });
    }
    async byNow(req, res) {
        const categoryTree = await getCategoryTree();
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
            categoryTree,
            user,
            listItemCart: cart,
            listVoucher,
            totalPriceAndDiscount,
        });
    }
}

module.exports = new CheckoutController();
