const homeRouter = require("./home.route");
const productRouter = require("./product.route");

module.exports.index = (app) => {
    app.use("/", homeRouter);
    app.use("/product", productRouter);
};
