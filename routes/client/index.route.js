const homeRouter = require("./home.route");
const productRouter = require("./product.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const cartRouter = require("./cart.route");

module.exports.index = (app) => {
    app.use("/", homeRouter);
    app.use("/product", productRouter);
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/cart", cartRouter);
};
