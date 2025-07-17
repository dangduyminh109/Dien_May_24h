const { uploadSingleImages } = require("./upload.helper.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

async function generalHelper(deleted = false) {
    let listUser = [];
    if (deleted) {
        listUser = await User.findWithDeleted({ deleted: true });
    } else {
        listUser = await User.find({});
    }
    return {
        totalUser: listUser.length,
    };
}

async function filterAndSort(req, findDelete = false) {
    var listUser = [];
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
            case "email":
            case "phone":
            case "address":
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
            : { order: 1 };
    listUser = await User[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption)
        .select("-password -googleId -facebookId");
    totalPage = await User[countMethod](filter);
    return {
        listUser,
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
            formData.avatar = url;
        } else if (edit && !url) {
            const user = await User.findOne({ _id: req.params.id });
            if (user.avatar == formData.thumbnailDeleted) {
                formData.avatar = "";
            }
        }
        if (formData.password == "") {
            delete formData.password;
        } else {
            formData.password = await bcrypt.hash(formData.password, 10);
        }
    } else {
        delete formData.avatar;
        formData.password = await bcrypt.hash(formData.password, 10);
    }
    return formData;
}

module.exports = { handleForm, filterAndSort, generalHelper };
