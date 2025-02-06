const pugHepper = require("../helpers/pug.helper");

module.exports = function (req, res, next) {
    res.locals.pugHepper = pugHepper;
    next();
};
