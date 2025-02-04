const system = require("../../config/system.js");
const Products = require("../../models/product.model.js");
const slugify = require("slugify");

class productController {
    // [GET] /admin/products/create
    show(req, res) {
        res.render("./admin/page/products/", {
            pageTitle: "Products",
            PATH_ADMIN: system.PATH_ADMIN,
        });
    }

    // [GET] /admin/products/create
    create(req, res) {
        res.render("./admin/page/products/create", {
            pageTitle: "Products",
            PATH_ADMIN: system.PATH_ADMIN,
        });
    }

    // [POST] /admin/products/create
    async createPost(req, res) {
        try {
            const formData = req.body;
            formData.original_price = isNaN(parseFloat(formData.original_price))
                ? 0
                : parseFloat(formData.original_price);
            formData.price = isNaN(parseFloat(formData.price))
                ? 0
                : parseFloat(formData.price);
            formData.discount = isNaN(parseFloat(formData.discount))
                ? 0
                : parseFloat(formData.discount);
            formData.inventory = isNaN(parseInt(formData.inventory))
                ? 0
                : parseInt(formData.inventory);
            formData.thumbnail = req.files?.length
                ? req.files.map((el) => `/uploads/${el.filename}`)
                : [];
            let slug = slugify(formData.name, {
                lower: true,
                strict: true,
            });
            let existingProduct = await Products.findOne({ slug });
            let count = 1;
            while (existingProduct) {
                slug = `${slug}-${count}`;
                existingProduct = await Products.findOne({ slug });
                count++;
            }
            formData.slug = slug;

            const newProduct = new Products(formData);
            await newProduct.save();

            res.redirect("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = new productController();
