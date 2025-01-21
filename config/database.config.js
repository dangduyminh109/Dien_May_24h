const mongoose = require("mongoose");

module.exports.connect = () => {
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log("Connected!"))
        .catch((err) => {
            console.log("connection failed", err);
            process.exit(1);
        });
};
