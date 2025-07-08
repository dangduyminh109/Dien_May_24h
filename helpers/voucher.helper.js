const Voucher = require("../models/voucher.model.js");

async function generalHelper(deleted = false) {
    let listVoucher = [];
    if (deleted) {
        listVoucher = await Voucher.findWithDeleted({
            deleted: true,
        });
    } else {
        listVoucher = await Voucher.find({});
    }
    return {
        totalVoucher: listVoucher.length,
    };
}

async function filterAndSort(req, findDelete = false) {
    var listVoucher = [];
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
            case "min-discountValue":
            case "max-discountValue":
                filter.discountValue = filter.discountValue || {};
                filter.discountValue[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;
            case "min-maxDiscount":
            case "max-maxDiscount":
                filter.maxDiscount = filter.maxDiscount || {};
                filter.maxDiscount[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;
            case "min-OrderValue":
            case "max-OrderValue":
                filter.minOrderValue = filter.minOrderValue || {};
                filter.minOrderValue[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;
            case "min-quantity":
            case "max-quantity":
                filter.quantity = filter.quantity || {};
                filter.quantity[key.includes("min") ? "$gte" : "$lte"] =
                    numValue;
                break;
            case "code":
            case "discountType":
            case "applyFor":
            case "startDate":
            case "expiredAt":
            case "status":
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

    listVoucher = await Voucher[queryMethod](filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOption);
    totalPage = await Voucher[countMethod](filter);
    return {
        listVoucher,
        pagination: {
            page,
            limit,
            totalPage: Math.ceil(totalPage / limit),
        },
    };
}

async function handleForm(req, edit = false) {
    let formData = req.body;
    if (edit) {
        formData.status = formData.status ? "on" : "off";
    }
    return formData;
}

module.exports = { filterAndSort, generalHelper, handleForm };
