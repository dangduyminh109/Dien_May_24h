const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        phone: String,
        avatar: String,
        address: String,
        status: { type: Boolean, default: true },
        googleId: String,
        facebookId: String,
        cart: {
            type: [
                {
                    _id: false,
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    quantity: { type: Number, required: true, min: 1 },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const User =
    mongoose.models.User || mongoose.model("User", userSchema, "users");

module.exports = User;
