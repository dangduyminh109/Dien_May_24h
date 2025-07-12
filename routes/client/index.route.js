const homeRouter = require("./home.route");
const productRouter = require("./product.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");

const attachContextMiddleware = require("../../middlewares/attachContext.middleware");

module.exports.index = (app) => {
    app.use("/", attachContextMiddleware, homeRouter);
    app.use("/product", attachContextMiddleware, productRouter);
    app.use("/user", attachContextMiddleware, userRouter);
    app.use("/cart", attachContextMiddleware, cartRouter);
    app.use("/checkout", attachContextMiddleware, checkoutRouter);
    app.use("/auth", authRouter);
};
