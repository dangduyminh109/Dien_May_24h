require("dotenv").config();
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");

const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database.config");
database.connect();

const app = express();
const port = process.env.PORT;

app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// override with POST having ?_method=...
app.use(methodOverride("_method"));

// Middleware để parse dữ liệu từ form (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware để parse dữ liệu JSON (nếu bạn sử dụng JSON)
app.use(express.json());

// set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// routes
routeClient.index(app);
routeAdmin.index(app);

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
