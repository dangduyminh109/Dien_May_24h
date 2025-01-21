class homeController{
    show(req, res) {
        res.render("./client/page/home/",{
            pageTitle: "Điện Máy 24h"
        });
    }
}

module.exports = new homeController();