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

async function filterAndSort(query, findDelete = false) {
    var listAccounts = [];
    const limit = 5;
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    const filter = Object.entries(query).reduce((obj, [key, value]) => {
        if (value !== "") {
            switch (key) {
                case "fullName":
                case "roleId":
                case "status":
                    obj[key] = value;
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
