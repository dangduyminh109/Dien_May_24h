const Role = require("../models/role.model.js");
const md5 = require("md5");
const { uploadSingleImages } = require("./upload.helper.js");
const Account = require("../models/account.model.js");

async function generalHelper(deleted = false) {
    const countMethod = deleted
        ? "countDocumentsWithDeleted"
        : "countDocuments";
    const obj = {};

    const listRoles = await Role.find({});
    if (deleted) {
        for (const role of listRoles) {
            obj[role.name] = await Account[countMethod]({
                roleId: role.id,
                deleted: true,
            });
        }
    } else {
        for (const role of listRoles) {
            obj[role.name] = await Account[countMethod]({
                roleId: role.id,
            });
        }
    }
    return obj;
}

async function filterAndSort(req, findDelete = false) {
    var listAccounts = [];
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
            case "fullName":
                filter.fullName = { $regex: value, $options: "i" };
                break;
            case "roleId":
            case "email":
            case "phone":
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
    listAccounts = await Account[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password -token");
    totalPage = await Account[countMethod](filter);
    return {
        listAccounts,
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
        if (url) {
            formData.avatar = url;
        } else if (!url) {
            const account = await Account.findOne({ _id: req.params.id });
            if (account.avatar == formData.thumbnailDeleted) {
                formData.avatar = "";
            }
        }
        // xử lí mật khẩu
        if (formData.password == "") {
            delete formData.password;
        } else {
            formData.password = md5(req.body.password);
        }
    } else {
        delete formData.avatar;
        formData.password = md5(req.body.password);
    }
    return formData;
}

module.exports = { handleForm, filterAndSort, generalHelper };
