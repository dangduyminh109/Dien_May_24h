const Role = require("../models/role.model");

async function roleHelper(req, findDelete = false) {
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
