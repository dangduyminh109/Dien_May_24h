const ProductCategory = require("../models/product-category.model.js");
const { uploadMultipleImages } = require("./upload.helper.js");
const slugify = require("slugify");

async function generalHelper(deleted = false) {
    let listProductCategory = [];
    if (deleted) {
        listProductCategory = await ProductCategory.findWithDeleted({
            deleted: true,
        });
    } else {
        listProductCategory = await ProductCategory.find({});
    }
    return {
        totalProductCategory: listProductCategory.length,
    };
}

async function filterAndSort(query, findDelete = false) {
    var listProductCategory = [];
    const limit = 5;
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    const filter = Object.entries(query).reduce((obj, [key, value]) => {
        if (value !== "") {
            switch (key) {
                case "name":
                    obj.name = { $regex: value, $options: "i" };
                    break;
                case "parentId":
                case "status":
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

    listProductCategory = await ProductCategory[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption);
    totalPage = await ProductCategory[countMethod](filter);
    return {
        listProductCategory,
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
    if (edit) {
        formData.thumbnailDeleted =
            formData.thumbnailDeleted != ""
                ? JSON.parse(formData.thumbnailDeleted)
                : [];
        formData.status = formData.status ? "on" : "off";
        let product = await ProductCategory.findOne({ _id: req.params.id });
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
    let count = await ProductCategory.countDocuments({ slug });
    if (count > 0) {
        slug = `${slug}-${count}`;
    }
    formData.slug = slug;
    return formData;
}

module.exports = { filterAndSort, generalHelper, handleForm };
