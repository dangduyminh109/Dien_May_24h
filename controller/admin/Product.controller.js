class productController {
    show(req, res) {
        res.render("./admin/page/products/", {
            pageTitle: "Products",
        });
    }

    create(req, res) {
        res.render("./admin/page/products/create", {
            pageTitle: "Products",
        });
    }
}

module.exports = new productController();
