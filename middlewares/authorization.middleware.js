module.exports = function authorization(requiredPermission) {
    return function (req, res, next) {
        if (
            !res.locals.permission ||
            !res.locals.permission.includes(requiredPermission)
        ) {
            return res
                .status(403)
                .json({ error: "Bạn không có quyền truy cập!" });
        }
        next();
    };
};
