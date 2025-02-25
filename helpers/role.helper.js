const Role = require("../models/role.model");

async function roleHelper(query, findDelete = false) {
    const limit = 5;
    let totalPage = 0;
    let page = query.page ? parseInt(query.page) : 1;
    const filter = Object.entries(query).reduce((obj, [key, value]) => {
        if (value !== "") {
            switch (key) {
                case "name":
                    obj.name = { $regex: value, $options: "i" };
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

    console.log(queryMethod);

    const listRoles = await Role[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit);

    totalPage = await Role[countMethod](filter);
    return {
        listRoles,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalPage / limit),
        },
    };
}
module.exports = { roleHelper };
