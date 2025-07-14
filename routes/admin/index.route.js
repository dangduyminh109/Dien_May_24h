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
const userRouter = require("./user.route");
const userTrashRouter = require("./user-trash.route");
const voucherRouter = require("./voucher.route");
const voucherTrashRouter = require("./voucher-trash.route");
const orderRouter = require("./order.route");
const orderTrashRouter = require("./order-trash.route");

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

    app.use(`${system.PATH_ADMIN}/user`, authMiddleware, userRouter);
    app.use(`${system.PATH_ADMIN}/user-trash`, authMiddleware, userTrashRouter);

    app.use(`${system.PATH_ADMIN}/voucher`, authMiddleware, voucherRouter);
    app.use(
        `${system.PATH_ADMIN}/voucher-trash`,
        authMiddleware,
        voucherTrashRouter
    );

    app.use(`${system.PATH_ADMIN}/order`, authMiddleware, orderRouter);
    app.use(
        `${system.PATH_ADMIN}/order-trash`,
        authMiddleware,
        orderTrashRouter
    );

    app.use(`${system.PATH_ADMIN}/auth`, authTrashRouter);
    app.get(`${system.PATH_ADMIN}`, authMiddleware, (req, res) => {
        return res.redirect(`${system.PATH_ADMIN}/dashboard`);
    });
};
