const mongoose = require("mongoose");

const initDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            serverSelectionTimeoutMS: 5000,
        })
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((error) => {
            console.log(error);
        });
};

const disconnectDB = () => {
    mongoose.disconnect();
    console.log("Database disconnected successfully");
};

module.exports = { initDB, disconnectDB };