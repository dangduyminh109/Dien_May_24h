const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const voucherSchema = new mongoose.Schema(
    {
        name: String,
        code: String,
        discountType: {
            type: String,
            enum: ["percent", "fixed"],
            default: "fixed",
        },
        discountValue: { type: Number, default: 0 },
        maxDiscount: { type: Number, default: 0 },
        minOrderValue: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        usedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        startDate: Date,
        expiredAt: Date,
        status: {
            type: String,
            default: "on",
        },
        description: String,
    },
    {
        timestamps: true,
    }
);

voucherSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const Voucher =
    mongoose.models.Voucher ||
    mongoose.model("Voucher", voucherSchema, "vouchers");

module.exports = Voucher;
