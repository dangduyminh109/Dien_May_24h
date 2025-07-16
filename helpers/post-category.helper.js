const PostCategory = require("../models/post-category.model.js");
const slugify = require("slugify");

async function generalHelper(deleted = false) {
    let listPostCategory = [];
    if (deleted) {
        listPostCategory = await PostCategory.findWithDeleted({
            deleted: true,
        });
    } else {
        listPostCategory = await PostCategory.find({});
    }
    return {
        totalPostCategory: listPostCategory.length,
    };
}

async function filterAndSort(req, findDelete = false) {
    var listPostCategory = [];
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

    listPostCategory = await PostCategory[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption);
    totalPage = await PostCategory[countMethod](filter);
    return {
        listPostCategory,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalPage / limit),
        },
    };
}

async function handleForm(req, edit = false) {
    let formData = req.body;
    // xửa lí trạng thái và sản phẩm nổi bật
    if (formData.status && formData.status == "on") formData.status = true;
    else formData.status = false;
    let slug = slugify(formData.name, {
        lower: true,
        strict: true,
    });
    let count = await PostCategory.countDocuments({ slug });
    if (count > 0) {
        slug = `${slug}-${count}`;
    }
    formData.slug = slug;
    return formData;
}

module.exports = { filterAndSort, generalHelper, handleForm };
