const ProductCategory = require("../models/product-category.model.js");
const getCategoryTree = async (parentId = "") => {
    const categories = await ProductCategory.find({
        parentId,
    });
    for (let category of categories) {
        category.children = await getCategoryTree(category._id);
    }
    return categories;
};

module.exports = getCategoryTree;
