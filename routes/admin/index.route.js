const authMiddleware = require("../../middlewares/auth.middleware");

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
const authTrashRouter = require("./auth.route");
const profileRouter = require("./profile.route");

module.exports.index = (app) => {
    app.use(`${system.PATH_ADMIN}/dashboard`, authMiddleware, dashboardRouter);
    app.use(`${system.PATH_ADMIN}/profile`, authMiddleware, profileRouter);
    app.use(`${system.PATH_ADMIN}/product`, authMiddleware, productRouter);
    app.use(
        `${system.PATH_ADMIN}/product-trash`,
        authMiddleware,
        productTrashRouter
    );
    app.use(
        `${system.PATH_ADMIN}/product-category`,
        authMiddleware,
        productCategoryRouter
    );
    app.use(
        `${system.PATH_ADMIN}/category-trash`,
        authMiddleware,
        categoryTrashRouter
    );
    app.use(`${system.PATH_ADMIN}/roles`, authMiddleware, roleRouter);
    app.use(
        `${system.PATH_ADMIN}/roles-trash`,
        authMiddleware,
        rolesTrashRouter
    );
    app.use(`${system.PATH_ADMIN}/accounts`, authMiddleware, accountRouter);
    app.use(
        `${system.PATH_ADMIN}/accounts-trash`,
        authMiddleware,
        accountsTrashRouter
    );
    app.use(`${system.PATH_ADMIN}/auth`, authTrashRouter);
};
