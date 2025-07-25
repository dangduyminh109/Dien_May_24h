const flash = require("express-flash");
const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const productSchema = new mongoose.Schema(
    {
        name: String,
        code: String,
        slug: { type: String, unique: true },
        original_price: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        inventory: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
        supplier: String,
        category: String,
        status: { type: Boolean, default: true },
        featured: { type: Boolean, default: false },
        description: String,
        thumbnails: Array,
    },
    {
        timestamps: true,
    }
);

productSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
});

const Product =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema, "products");

module.exports = Product;
