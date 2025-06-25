const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");

class CartController {
    async show(req, res) {
        const categoryTree = await getCategoryTree();
        const sessionUser = req.session.user || req.user || null;
        let user = null;
        let cart = req.session.cart || [];
        if (sessionUser) {
            user = await User.findById(sessionUser._id).populate(
                "cart.productId"
            );
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
        res.render("./client/page/cart/", {
            pageTitle: "Điện Máy 24h",
            categoryTree,
            user,
            cart,
        });
    }

    async add(req, res) {
        const sessionUser = req.session.user || req.user || null;
        let user = null;
        if (sessionUser) {
            user = await User.findById(sessionUser._id).populate("cart.productId");
            const existingItem = user.cart.find(
                (item) => item.productId == req.body.productId
            );
            if (existingItem) {
                existingItem.quantity += parseInt(req.body.quantity);
                await user.save();
            } else {
                user.cart.push({
                    productId: req.body.productId,
                    quantity: parseInt(req.body.quantity),
                });
                await user.save();
            }
        } else {
            req.session.cart = req.session.cart || [];
            const existingItem = req.session.cart.find(
                (item) => item.productId == req.body.productId
            );
            if (existingItem) {
                existingItem.quantity += parseInt(req.body.quantity);
            } else {
                req.session.cart.push({
                    productId: req.body.productId,
                    quantity: parseInt(req.body.quantity),
                });
            }
        }
        res.redirect("back");
    }

    async delete(req, res) {
        const sessionUser = req.session.user || req.user || null;
        let user = null;
        console.log(req.params.id);
        if (sessionUser) {
            user = await User.findById(sessionUser._id).populate("cart.productId");
            user.cart = user.cart.filter((item) => {
                return item.productId._id != req.params.id;
            });
            await user.save();
        } else {
            req.session.cart = req.session.cart.filter(
                (item) => item.productId != req.params.id
            );
        }
        res.redirect("back");
    }
}

module.exports = new CartController();
