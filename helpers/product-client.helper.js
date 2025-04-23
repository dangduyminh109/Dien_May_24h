const Product = require("../models/product.model");
const ProductCategory = require("../models/product-category.model");

async function filterAndSort(query, category) {
    const limit = 12;
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    let sortOption = {};
    if (query.filter === "price-asc") {
        sortOption.price = 1;
    } else if (query.filter === "price-desc") {
        sortOption.price = -1;
    }
    let listIdCategory = {};
    if (category) {
        const listCategory = await ProductCategory.find({
            parentId: category._id,
        }).select("_id");

        listIdCategory = listCategory.map((category) => category._id);
    }

    let findOption = {};
    if (category) {
        findOption.category = { $in: [category._id, ...listIdCategory] };
    } else {
        findOption.featured = true;
    }

    const listProduct = await Product.find(findOption)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

    let countOption = {};
    if (category) {
        countOption.category = { $in: [category._id, ...listIdCategory] };
    } else {
        countOption.featured = true;
    }
    totalPage = await Product.countDocuments(countOption);
    return {
        listProduct,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalPage / limit),
        },
    };
}
module.exports = { filterAndSort };
