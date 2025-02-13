const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const productCategorySchema = new mongoose.Schema(
    {
        name: String,
        slug: { type: String, unique: true },
        parentId: {
            type: "String",
            default: "",
        },
        status: String,
        description: String,
        thumbnails: Array,
    },
    {
        timestamps: true,
    }
);

productCategorySchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const ProductCategory = mongoose.model(
    "ProductCategory",
    productCategorySchema,
    "product-category"
);

module.exports = ProductCategory;
