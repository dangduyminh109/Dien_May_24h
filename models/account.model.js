const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { generateString } = require("../helpers/generate-string.helper");

const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        phone: String,
        password: String,
        token: { type: String, default: generateString() },
        avatar: String,
        roleId: String,
        status: String,
    },
    {
        timestamps: true,
    }
);

accountSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const Account =
    mongoose.models.Account ||
    mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
