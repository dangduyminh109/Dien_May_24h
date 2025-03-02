const system = require("../../config/system");
const dashboardRouter = require("./dashboard.route");
const productRouter = require("./product.route");
const productTrashRouter = require("./product-trash.route");
const productCategoryRouter = require("./product-category.route");
const categoryTrashRouter = require("./category-trash.route");
const roleRouter = require("./role.route");
const rolesTrashRouter = require("./role-trash.route");
const accountRouter = require("./account.route");
const accountsTrashRouter = require("./account-trash.route");

module.exports.index = (app) => {
    app.use(`${system.PATH_ADMIN}/dashboard`, dashboardRouter);
    app.use(`${system.PATH_ADMIN}/product`, productRouter);
    app.use(`${system.PATH_ADMIN}/product-trash`, productTrashRouter);
    app.use(`${system.PATH_ADMIN}/product-category`, productCategoryRouter);
    app.use(`${system.PATH_ADMIN}/category-trash`, categoryTrashRouter);
    app.use(`${system.PATH_ADMIN}/roles`, roleRouter);
    app.use(`${system.PATH_ADMIN}/roles-trash`, rolesTrashRouter);
    app.use(`${system.PATH_ADMIN}/accounts`, accountRouter);
    app.use(`${system.PATH_ADMIN}/accounts-trash`, accountsTrashRouter);
};
