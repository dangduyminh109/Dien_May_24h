const mongoose = require("mongoose");
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
    const discountTypeList = ["all"];
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - user.createdAt <= sevenDays) {
        discountTypeList.push("new-user");
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    const listVoucher = await Voucher.aggregate([
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
                $expr: {
                    $and: [
                        { $gte: ["$quantity", "$usedCount"] },
                        { $not: [{ $in: [userId, "$usedBy"] }] },
                    ],
                },
            },
        },
    ]);

    return listVoucher;
}

module.exports = { TotalPriceAndDiscount, getListVoucher };
