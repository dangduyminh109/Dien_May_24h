const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const roleSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        permission: { type: Array, default: [] },
    },
    {
        timestamps: true,
    }
);

roleSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const Role = mongoose.models.role || mongoose.model("Role", roleSchema);

module.exports = Role;
