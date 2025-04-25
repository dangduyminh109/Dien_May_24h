const Product = require("../models/product.model");
const ProductCategory = require("../models/product-category.model");

async function filterAndSort(req) {
    const limit = 12;
    let totalPage = 0;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let pageTitle = "Danh Sách Sản Phẩm";

    let sortOption = {};
    if (req.query.filter === "price-asc") {
        sortOption.price = 1;
    } else if (req.query.filter === "price-desc") {
        sortOption.price = -1;
    }

    let optionQuery = {};
    let listIdCategory = {};
    let category = {};
    if (req.params.slug == "featured") {
        optionQuery.featured = true;
        pageTitle = "Sản Phẩm Nổi Bật";
    } else if (req.params.slug) {
        category = await ProductCategory.findOne({
            slug: req.params.slug,
        });
        const listCategory = await ProductCategory.find({
            parentId: category._id,
        }).select("_id");
        listIdCategory = listCategory.map((category) => category._id);
        optionQuery.category = { $in: [category._id, ...listIdCategory] };
        pageTitle = category.name;
    } else if (req.query.keyword) {
        optionQuery.name = { $regex: req.query.keyword || "", $options: "i" };
        pageTitle = "Kết Quả Tìm Kiếm";
    }

    const listProduct = await Product.find(optionQuery)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

    totalPage = await Product.countDocuments(optionQuery);

    return {
        listProduct,
        category,
        pageTitle,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalPage / limit),
        },
    };
}
module.exports = { filterAndSort };
