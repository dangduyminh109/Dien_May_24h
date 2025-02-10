const Product = require("../models/product.model");
const { uploadMultipleImages } = require("../helpers/upload.helper.js");
const slugify = require("slugify");

async function generalHelper(deleted = false) {
    let listProduct = await Product.find({});
    if (deleted) {
        listProduct = await Product.findWithDeleted({ deleted: true });
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

async function filterAndSort(query, findDelete = false) {
    var listProduct = [];
    const limit = 5;
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    const filter = Object.entries(query).reduce((obj, [key, value]) => {
        if (value !== "") {
            switch (key) {
                case "min-original-price":
                    obj["original_price"] = {
                        ...obj["original_price"],
                        $gte: Number(value),
                    };
                    break;
                case "max-original-price":
                    obj["original_price"] = {
                        ...obj["original_price"],
                        $lte: Number(value),
                    };
                    break;
                case "min-price":
                    obj.price = { ...obj.price, $gte: Number(value) };
                    break;
                case "max-price":
                    obj.price = { ...obj.price, $lte: Number(value) };
                    break;
                case "min-discount":
                    obj.discount = { ...obj.discount, $gte: Number(value) };
                    break;
                case "max-discount":
                    obj.discount = { ...obj.discount, $lte: Number(value) };
                    break;
                case "min-inventory":
                    obj.inventory = { ...obj.inventory, $gte: Number(value) };
                    break;
                case "max-inventory":
                    obj.inventory = { ...obj.inventory, $lte: Number(value) };
                    break;
                case "name":
                    obj[key] = value;
                    break;
                case "code":
                    obj[key] = value;
                    break;
                case "category":
                    obj[key] = value;
                    break;
                case "status":
                    obj[key] = value;
                    break;
            }
        }
        return obj;
    }, {});
    if (query.page == false) {
        query.page = 0;
    }
    if (query.type === "asc" || query.type === "desc") {
        const sortType = query.type === "asc" ? 1 : -1;
        if (findDelete) {
            if (filter.name) {
                listProduct = await Product.findWithDeleted({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                    deleted: true,
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({
                        [query.filed]: sortType,
                    });

                totalPage = await Product.countDocumentsWithDeleted({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                    deleted: true,
                });
            } else {
                listProduct = await Product.findWithDeleted({
                    ...filter,
                    deleted: true,
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({
                        [query.filed]: sortType,
                    });

                totalPage = await Product.countDocumentsWithDeleted({
                    ...filter,
                    deleted: true,
                });
            }
        } else {
            if (filter.name) {
                listProduct = await Product.find({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({
                        [query.filed]: sortType,
                    });
                totalPage = await Product.countDocuments({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                });
            } else {
                listProduct = await Product.find(filter)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({
                        [query.filed]: sortType,
                    });
                totalPage = await Product.countDocuments(filter);
            }
        }
    } else {
        if (findDelete) {
            if (filter.name) {
                listProduct = await Product.findWithDeleted({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                    deleted: true,
                })
                    .skip((page - 1) * limit)
                    .limit(limit);

                totalPage = await Product.countDocumentsWithDeleted({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                    deleted: true,
                });
            } else {
                listProduct = await Product.findWithDeleted({
                    ...filter,
                    deleted: true,
                })
                    .skip((page - 1) * limit)
                    .limit(limit);

                totalPage = await Product.countDocumentsWithDeleted({
                    ...filter,
                    deleted: true,
                });
            }
        } else {
            if (filter.name) {
                listProduct = await Product.find({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                })
                    .skip((page - 1) * limit)
                    .limit(limit);
                totalPage = await Product.countDocuments({
                    ...filter,
                    name: { $regex: filter.name, $options: "i" },
                });
            } else {
                listProduct = await Product.find(filter)
                    .skip((page - 1) * limit)
                    .limit(limit);
                totalPage = await Product.countDocuments(filter);
            }
        }
    }
    totalPage = Math.ceil(totalPage / limit);
    return { listProduct, pagination: { page, limit, totalPage } };
}

async function handleForm(req, edit = false) {
    const urls = await uploadMultipleImages(req.files);
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
    if (edit) {
        formData.thumbnailDeleted =
            formData.thumbnailDeleted != ""
                ? JSON.parse(formData.thumbnailDeleted)
                : [];
        formData.status = formData.status ? "on" : "off";
        let product = await Product.findOne({ _id: req.params.id });
        formData.thumbnails = urls?.length
            ? urls.concat(product.thumbnails)
            : product.thumbnails;
        if (formData.thumbnailDeleted.length > 0) {
            formData.thumbnails = formData.thumbnails.filter((item) => {
                if (formData.thumbnailDeleted.includes(item) == false) {
                    return item;
                }
            });
        }
    } else {
        formData.thumbnails = urls?.length ? urls : [];
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
