const getCategoryTree = require("../helpers/get-category-tree.helper.js");

module.exports = async function attachContextMiddleware(req, res, next) {
    let categoryTree = req.session.categoryTree || null;
    if (!categoryTree) {
        categoryTree = await getCategoryTree();
        req.session.categoryTree = categoryTree;
    }
    const user = req.session.user || req.user || null;
    const cart = req.session.cart || [];

    res.locals.categoryTree = categoryTree;
    res.locals.user = user;
    res.locals.cart = cart;
    next();
};
