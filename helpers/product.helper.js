const Product = require("../models/product.model");
const { uploadMultipleImages } = require("../helpers/upload.helper.js");
const slugify = require("slugify");

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

async function filterAndSort(query, findDelete = false) {
    var listProduct = [];
    const limit = 5;
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    console.log(query);
    const filter = Object.entries(query).reduce((obj, [key, value]) => {
        if (value !== "") {
            const numValue = Number(value);
            switch (key) {
                case "min-original-price":
                case "max-original-price":
                    obj["original_price"] = {
                        ...obj["original_price"],
                        [key.includes("min") ? "$gte" : "$lte"]: numValue,
                    };
                    break;
                case "min-price":
                case "max-price":
                    obj.price = {
                        ...obj.price,
                        [key.includes("min") ? "$gte" : "$lte"]: numValue,
                    };
                    break;
                case "min-discount":
                case "max-discount":
                    obj.discount = {
                        ...obj.discount,
                        [key.includes("min") ? "$gte" : "$lte"]: numValue,
                    };
                    break;
                case "min-inventory":
                case "max-inventory":
                    obj.inventory = {
                        ...obj.inventory,
                        [key.includes("min") ? "$gte" : "$lte"]: numValue,
                    };
                    break;
                case "name":
                    obj.name = { $regex: value, $options: "i" };
                    break;
                case "category":
                case "status":
                case "code":
                    obj[key] = value; 
            }
        }
        return obj;
    }, {});


    if (findDelete) filter.deleted = true;
    const queryMethod = findDelete ? "findWithDeleted" : "find";
    const countMethod = findDelete
        ? "countDocumentsWithDeleted"
        : "countDocuments";
    const sortOption =
        query.type === "asc" || query.type === "desc"
            ? { [query.filed]: query.type === "asc" ? 1 : -1 }
            : {};

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
