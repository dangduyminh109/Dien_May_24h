const Product = require("../models/product.model");

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

module.exports = { filterAndSort, generalHelper };
