const Voucher = require("../models/voucher.model.js");
function TotalPriceAndDiscount(cart, voucher = null) {
    const totalPrice = cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    let discount = 0;
    if (voucher) {
        if (voucher.discountType === "fixed") discount = voucher.discountValue;
        else {
            discount = (voucher.discountValue * totalPrice) / 100;
            if (discount > voucher.maxDiscount) discount = voucher.maxDiscount;
        }
    }
    return {
        totalPrice,
        discount,
    };
}

async function getListVoucher(user) {
    let discountTypeList = ["all"];
    let index = 1;
    if (user.createdAt + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
        discountTypeList[index] = "new-user";
        index++;
    }
    let listVoucher = await Voucher.aggregate([
        {
            $match: {
                expiredAt: { $gte: new Date() },
                applyFor: { $in: discountTypeList },
                status: "on",
            },
        },
        {
            $addFields: {
                usedCount: { $size: "$usedBy" },
            },
        },
        {
            $match: {
                $expr: { $gte: ["$quantity", "$usedCount"] },
            },
        },
    ]);
    return listVoucher;
}

module.exports = { TotalPriceAndDiscount, getListVoucher };
