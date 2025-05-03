require("dotenv").config();
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database.config");
const sortMiddleware = require("./middlewares/sort.middleware");
const pugHelperMiddleware = require("./middlewares/pugHelper.middleware");
const utils = require("./utils");
const passportConfig = require("./config/passport");

database.connect();

const app = express();
const port = process.env.PORT;

// override with POST having ?_method=...
app.use(methodOverride("_method"));

// Middleware để parse dữ liệu từ form (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware để parse dữ liệu JSON (nếu bạn sử dụng JSON)
app.use(express.json());

// sort Middleware
app.use(sortMiddleware);

// pug Helper Middleware
app.use(pugHelperMiddleware);

app.locals.utils = utils;

// tinymce
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// express-session
app.use(
    session({
        secret: process.env.EXPRESS_SESSION,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 ngày
    })
);

// Kích hoạt flash messages
app.use(cookieParser(process.env.COOKIE_PARSER));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// routes
routeClient.index(app);
routeAdmin.index(app);

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
