const md5 = require("md5");
const { uploadSingleImages } = require("./upload.helper.js");
const User = require("../models/user.model.js");

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

async function filterAndSort(query, findDelete = false) {
    var listUser = [];
    const limit = 5;
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    const filter = Object.entries(query).reduce((obj, [key, value]) => {
        if (value !== "") {
            switch (key) {
                case "name":
                    obj.name = { $regex: value, $options: "i" };
                    break;
                case "email":
                case "phone":
                case "address":
                    obj[key] = value;
                    break;
                case "status":
                    obj[key] = value === "on";
                    break;
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
    formData.avatar = url || "";
    if (edit) {
        formData.status = formData.status ? "on" : "off";
        if (!url) {
            delete formData.avatar;
        }
        if (formData.password == "") {
            delete formData.password;
        } else {
            formData.password = md5(req.body.password);
        }
    } else {
        formData.password = md5(req.body.password);
    }
    return formData;
}

module.exports = { handleForm, filterAndSort, generalHelper };
