const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        product: [
            {
                _id: false,
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        totalAmount: Number,
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        voucher: {
            type: String,
            default: null,
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "BANK"],
            default: "COD",
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
            default: null,
        },
        note: {
            type: String,
            default: null,
        },
        transactionRef: {
            type: String,
            default: null,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});
orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Order =
    mongoose.models.Order || mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
