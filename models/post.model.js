const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true },
        content: { type: String, required: true },
        thumbnail: String,
        tags: [String],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PostCategory",
        },
        status: {
            type: String,
            enum: ["public", "draft", "hidden"],
            default: "draft",
        },
        viewCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

postSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const Post =
    mongoose.models.Post || mongoose.model("Post", postSchema, "posts");

module.exports = Post;
