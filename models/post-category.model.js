const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const postCategorySchema = new mongoose.Schema(
    {
        name: String,
        slug: { type: String, unique: true },
        parentId: {
            type: "String",
            default: "",
        },
        status: { type: Boolean, default: true },
        description: String,
    },
    {
        timestamps: true,
    }
);

postCategorySchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const PostCategory =
    mongoose.models.PostCategory ||
    mongoose.model("PostCategory", postCategorySchema, "post-category");

module.exports = PostCategory;
