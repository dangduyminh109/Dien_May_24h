const Product = require("../models/product.model");
const ProductCategory = require("../models/product-category.model.js");
const { uploadMultipleImages } = require("../helpers/upload.helper.js");
const slugify = require("slugify");
const getCategoryTree = require("./get-category-tree.helper.js");
const mongoose = require("mongoose");

async function generalHelper(deleted = false) {
    let listProduct = [];
    if (deleted) {
        listProduct = await Product.findWithDeleted({ deleted: true });
    } else {
        listProduct = await Product.find({});
    }
    return {
        totalProduct: listProduct.length,
        inventory: listProduct.reduce(
            (init, item) => (init += item.inventory),
            0
        ),
        outOfStock: listProduct.reduce(
            (init, item) => (init = item.inventory <= 0 ? init++ : init),
            0
        ),
        inventoryTotalValue: listProduct.reduce(
            (init, item) => (init += item.price * item.inventory),
            0
        ),
    };
}

async function filterAndSort(req, findDelete = false) {
    var listProduct = [];
    let limit = 5;
    let query = req.query;
    if (query.show) {
        limit = parseInt(query.show);
        req.session.limit = limit;
    } else if (req.session.limit) {
        limit = req.session.limit;
    }
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    const filter = {};
    for (const [key, value] of Object.entries(query)) {
        if (value === "") continue;
        const numValue = Number(value);
        switch (key) {
            case "min-original-price":
            case "max-original-price":
                filter.original_price = filter.original_price || {};
                filter.original_price[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;

            case "min-price":
            case "max-price":
                filter.price = filter.price || {};
                filter.price[key.includes("min") ? "$gte" : "$lte"] = numValue;
                break;

            case "min-discount":
            case "max-discount":
                filter.discount = filter.discount || {};
                filter.discount[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;

            case "min-inventory":
            case "max-inventory":
                filter.inventory = filter.inventory || {};
                filter.inventory[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;

            case "name":
                filter.name = { $regex: value, $options: "i" };
                break;

            case "category":
                const listSubCategory = await getCategoryTree(
                    ProductCategory,
                    value
                );
                filter.category = {
                    $in: [
                        new mongoose.Types.ObjectId(value),
                        ...listSubCategory.map(
                            (item) => new mongoose.Types.ObjectId(item._id)
                        ),
                    ],
                };
                break;

            case "code":
                filter[key] = value;
                break;
            case "status":
            case "featured":
                filter[key] = value === "on";
                break;
        }
    }

    if (findDelete) filter.deleted = true;
    const queryMethod = findDelete ? "findWithDeleted" : "find";
    const countMethod = findDelete
        ? "countDocumentsWithDeleted"
        : "countDocuments";
    const sortOption =
        query.type === "asc" || query.type === "desc"
            ? { [query.filed]: query.type === "asc" ? 1 : -1 }
            : { order: 1 };
    listProduct = await Product[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption);
    totalPage = await Product[countMethod](filter);
    return {
        listProduct,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalPage / limit),
        },
    };
}

async function handleForm(req, edit = false) {
    let formData = req.body;
    formData.original_price = isNaN(parseFloat(formData.original_price))
        ? 0
        : parseFloat(formData.original_price);
    formData.price = isNaN(parseFloat(formData.price))
        ? 0
        : parseFloat(formData.price);
    formData.discount = isNaN(parseFloat(formData.discount))
        ? 0
        : parseFloat(formData.discount);
    formData.inventory = isNaN(parseInt(formData.inventory))
        ? 0
        : parseInt(formData.inventory);

    // xửa lí trạng thái và sản phẩm nổi bật
    if (formData.status && formData.status == "on") formData.status = true;
    else formData.status = false;

    if (formData.featured && formData.featured == "on")
        formData.featured = true;
    else formData.featured = false;

    // xử lí hình ảnh
    const urls = (await uploadMultipleImages(req.files)) || [];
    if (edit && formData.thumbnailDeleted) {
        const product = await Product.findOne({ _id: req.params.id });
        formData.thumbnails = [...urls, ...product.thumbnails];
        formData.thumbnailDeleted =
            formData.thumbnailDeleted != ""
                ? JSON.parse(formData.thumbnailDeleted)
                : [];
        if (formData.thumbnailDeleted.length > 0) {
            formData.thumbnails = formData.thumbnails.filter(
                (item) => !formData.thumbnailDeleted.includes(item)
            );
        }
    }
    let slug = slugify(formData.name, {
        lower: true,
        strict: true,
    });
    let count = await Product.countDocuments({ slug });
    if (count > 0) {
        slug = `${slug}-${count}`;
    }
    formData.slug = slug;
    return formData;
}

module.exports = { filterAndSort, generalHelper, handleForm };
