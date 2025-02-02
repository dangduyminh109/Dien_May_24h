const system = require("../../config/system");
const dashboardRouter = require("./dashboard.route");
const productRouter = require("./product.route");

module.exports.index = (app) => {
    app.use(`${system.PATH_ADMIN}/dashboard`, dashboardRouter);
    app.use(`${system.PATH_ADMIN}/product`, productRouter);
};
