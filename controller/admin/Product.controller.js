const system = require("../../config/system.js");
const Product = require("../../models/product.model.js");
const { filterAndSort, general } = require("../../helpers/product.helper.js");
const slugify = require("slugify");

class productController {
    // [GET] /admin/products
    async show(req, res) {
        const listProduct = await filterAndSort(req.query);
        res.render("./admin/page/products", {
            pageTitle: "Products",
            PATH_ADMIN: system.PATH_ADMIN,
            listProduct,
            general: general(listProduct),
            filter: req.query,
        });
    }

    // [GET] /admin/products/create
    create(req, res) {
        res.render("./admin/page/products/create", {
            pageTitle: "Create products",
            PATH_ADMIN: system.PATH_ADMIN,
        });
    }

    // [GET] /admin/products/edit
    async edit(req, res) {
        const product = await Product.findOne({ _id: req.params.id });
        res.render("./admin/page/products/edit", {
            pageTitle: "edit Products",
            PATH_ADMIN: system.PATH_ADMIN,
            product,
        });
    }

    // [GET] /admin/products/products-trash
    async productsTrash(req, res) {
        const listDeletedProduct = await filterAndSort(req.query, true);
        res.render("./admin/page/products/products-trash", {
            pageTitle: "Create products",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedProduct,
            general: general(listDeletedProduct),
            filter: req.query,
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
            formData.thumbnails = req.files?.length
                ? req.files.map((el) => `/uploads/${el.filename}`)
                : [];
            let slug = slugify(formData.name, {
                lower: true,
                strict: true,
            });
            let existingProduct = await Product.findOne({ slug });
            let count = 1;
            while (existingProduct) {
                slug = `${slug}-${count}`;
                existingProduct = await Product.findOne({ slug });
                count++;
            }
            formData.slug = slug;

            const newProduct = new Product(formData);
            await newProduct.save();

            res.redirect("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // [PATCH] /admin/products/edit:id
    async editPost(req, res) {
        try {
            const formData = req.body;
            formData.thumbnailDeleted =
                formData.thumbnailDeleted != ""
                    ? JSON.parse(formData.thumbnailDeleted)
                    : [];
            formData.status = formData.status ? "on" : "off";
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

            let thumb = await Product.findOne({ _id: req.params.id });
            formData.thumbnails = req.files?.length
                ? req.files
                      .map((e) => `/uploads/${e.filename}`)
                      .concat(
                          thumb.thumbnails.filter((path) =>
                              path.startsWith("/uploads")
                          )
                      )
                : thumb.thumbnails.filter((path) =>
                      path.startsWith("/uploads")
                  );
            if (formData.thumbnailDeleted.length > 0) {
                formData.thumbnails = formData.thumbnails.filter((item) => {
                    if (formData.thumbnailDeleted.includes(item) == false) {
                        return item;
                    }
                });
            }
            let slug = slugify(formData.name, {
                lower: true,
                strict: true,
            });
            let existingProduct = await Product.findOne({ slug });
            let count = 1;
            while (existingProduct) {
                slug = `${slug}-${count}`;
                existingProduct = await Product.findOne({ slug });
                count++;
            }
            formData.slug = slug;
            await Product.updateOne({ _id: req.params.id }, formData);
            res.redirect("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // [PATCH] /admin/products/update-price
    async updatePricePatch(req, res) {
        const priceUpdate = req.body;
        await Product.updateOne(
            { _id: priceUpdate._id },
            { [priceUpdate.field]: parseInt(priceUpdate.value) }
        );

        res.json({ message: "Cập nhật thành công" });
    }

    // [PATCH] /admin/products/update-status
    async updateStatusPatch(req, res) {
        const priceUpdate = req.body;
        await Product.updateOne(
            { _id: priceUpdate._id },
            { status: priceUpdate.value }
        );

        res.json({ message: "Cập nhật thành công" });
    }

    // [PATCH] /admin/products/restore-status
    async restore(req, res) {
        await Product.restore({ _id: req.params.id });
        res.redirect("/admin/product/products-trash");
    }

    // [DELETE] /admin/products/delete-product/:id
    async delete(req, res) {
        await Product.delete({ _id: req.params.id });
        res.redirect("/admin/product");
    }

    // [DELETE] /admin/products/destroy-product/:id
    async destroy(req, res) {
        await Product.deleteOne({ _id: req.params.id });
        res.redirect("/admin/product/products-trash");
    }
}

module.exports = new productController();
