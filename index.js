require("dotenv").config();
const path = require("path");
const express = require("express");

const routeClient = require("./routes/client/index.route");
const database = require("./config/database.config");
database.connect();


const app = express();
const port = process.env.PORT;

// set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// routes
routeClient.index(app);

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
