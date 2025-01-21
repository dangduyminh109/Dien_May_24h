const path = require("path");
const express = require("express");

const app = express();
const port = 3000;

// set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index.pug");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
