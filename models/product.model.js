const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: String,
        code: String,
        slug: { type: String, unique: true },
        original_pice: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        inventory: { type: Number, default: 0 },
        supplier: String,
        category: String,
        status: String,
        description: String,
        thumbnail: Array,
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;
