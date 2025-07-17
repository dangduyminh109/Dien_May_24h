const ProductCategory = require("../models/product-category.model.js");
const { uploadSingleImages } = require("./upload.helper.js");
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

async function filterAndSort(req, findDelete = false) {
    var listProductCategory = [];
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
        switch (key) {
            case "name":
                filter.name = { $regex: value, $options: "i" };
                break;
            case "parentId":
                filter[key] = value;
                break;
            case "status":
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
    const url = await uploadSingleImages(req.file);
    let formData = req.body;
    // xửa lí trạng thái
    if (formData.status && formData.status == "on") formData.status = true;
    else formData.status = false;
    if (edit) {
        if (edit && url) {
            formData.thumbnail = url;
        } else if (edit && !url) {
            const category = await ProductCategory.findOne({
                _id: req.params.id,
            });
            if (category.thumbnail == formData.thumbnailDeleted) {
                formData.thumbnail = "";
            }
        }
    } else {
        delete formData.thumbnail;
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
