class dashboardController {
    show(req, res) {
        res.render("./admin/page/dashboard/", {
            pageTitle: "Điện Máy 24h - admin",
        });
    }
}

module.exports = new dashboardController();
