const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const otpSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);

otpSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema, "otps");

module.exports = Otp;
