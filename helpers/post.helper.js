const slugify = require("slugify");
const { uploadSingleImages } = require("./upload.helper.js");
const Post = require("../models/post.model.js");

async function generalHelper(deleted = false) {
    let listPost = [];
    if (deleted) {
        listPost = await Post.findWithDeleted({
            deleted: true,
        });
    } else {
        listPost = await Post.find({});
    }
    return {
        totalPost: listPost.length,
    };
}

async function filterAndSort(req, findDelete = false) {
    var listPost = [];
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
            case "title":
                filter.title = { $regex: value, $options: "i" };
                break;
            case "category":
            case "status":
                filter[key] = value;
                break;
        }
    }

    if (findDelete) filter.deleted = true;
    const queryMethod = findDelete ? "findWithDeleted" : "find";
    const countMethod = findDelete
        ? "countDocumentsWithDeleted"
        : "countDocuments";
    listPost = await Post[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name");
    totalPage = await Post[countMethod](filter);
    return {
        listPost,
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
    if (edit && url) {
        formData.thumbnail = url;
    } else if (edit && !url) {
        const post = await Post.findOne({ _id: req.params.id });
        if (post.thumbnail == formData.thumbnailDeleted) {
            formData.thumbnail = "";
        }
    } else {
        delete formData.thumbnail;
    }
    let slug = slugify(formData.title, {
        lower: true,
        strict: true,
    });
    let count = await Post.countDocuments({ slug });
    if (count > 0) {
        slug = `${slug}-${count}`;
    }
    // handle tags
    listTag = JSON.parse(formData.tags || "[]");
    if (Array.isArray(listTag)) {
        listTag = listTag.map((tag) => tag.value.trim());
        formData.tags = listTag;
    }

    formData.slug = slug;
    return formData;
}

module.exports = { handleForm, filterAndSort, generalHelper };
