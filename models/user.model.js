const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const cartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        phone: String,
        avatar: String,
        sex: String,
        dateOfBirth: Date,
        googleId: String,
        facebookId: String,
        cart: [cartItemSchema],
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
