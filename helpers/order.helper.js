const Order = require("../models/order.model.js");

async function generalHelper(deleted = false) {
    let listOrder = [];
    if (deleted) {
        listOrder = await Order.findWithDeleted({
            deleted: true,
        });
    } else {
        listOrder = await Order.find({});
    }
    return {
        totalOrder: listOrder.length,
    };
}

async function filterAndSort(req, findDelete = false) {
    var listOrder = [];
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
    Object.entries(query).forEach(([key, value]) => {
        if (value === "") return;
        const numValue = Number(value);
        switch (key) {
            case "name":
                filter.name = { $regex: value, $options: "i" };
                break;
            case "min-totalAmount":
            case "max-totalAmount":
                filter.totalAmount = filter.totalAmount || {};
                filter.totalAmount[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;

            case "isPaid":
                if (value === "on") filter.isPaid = true;
                else if (value === "off") filter.isPaid = false;
                else filter.isPaid = null;
                break;
            case "_id":
            case "status":
            case "paymentMethod":
                filter[key] = value;
                break;
        }
    });
    if (findDelete) filter.deleted = true;
    const queryMethod = findDelete ? "findWithDeleted" : "find";
    const countMethod = findDelete
        ? "countDocumentsWithDeleted"
        : "countDocuments";
    const sortOption =
        query.type === "asc" || query.type === "desc"
            ? { [query.filed]: query.type === "asc" ? 1 : -1 }
            : {};

    listOrder = await Order[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name")
        .populate("voucher", "code")
        .sort(sortOption);
    totalPage = await Order[countMethod](filter);
    return {
        listOrder,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalPage / limit),
        },
    };
}

function handleForm(req, edit = false) {
    let formData = req.body;
    const listProduct = formData.productId.map((item, index) => {
        return {
            productId: item,
            quantity: formData.quantity[index],
        };
    });
    formData.product = listProduct;
    delete formData.productId;
    delete formData.quantity;
    formData.isPaid = formData.isPaid === "on";
    if (!formData.voucher || formData.voucher == "") {
        formData.voucher = null;
    }
    return formData;
}

module.exports = { filterAndSort, generalHelper, handleForm };
