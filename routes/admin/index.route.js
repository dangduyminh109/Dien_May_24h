const system = require("../../config/system");
const dashboardRouter = require("./dashboard.route");
const productRouter = require("./product.route");
const productTrashRouter = require("./product-trash.route");
const productCategoryRouter = require("./product-category.route");
const categoryTrashRouter = require("./category-trash.route");

module.exports.index = (app) => {
    app.use(`${system.PATH_ADMIN}/dashboard`, dashboardRouter);
    app.use(`${system.PATH_ADMIN}/product`, productRouter);
    app.use(`${system.PATH_ADMIN}/product-trash`, productTrashRouter);
    app.use(`${system.PATH_ADMIN}/product-category`, productCategoryRouter);
    app.use(`${system.PATH_ADMIN}/category-trash`, categoryTrashRouter);
};
