const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

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
