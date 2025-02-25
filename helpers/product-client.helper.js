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
    const listCategory = await ProductCategory.find({
        parentId: category._id,
    }).select("_id");

    const listIdCategory = listCategory.map((category) => category._id);

    const listProduct = await Product.find({
        category: { $in: [category._id, ...listIdCategory] },
    })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    totalPage = await Product.countDocuments({
        category: { $in: [category._id, ...listIdCategory] },
    });
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
