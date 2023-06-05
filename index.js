const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const dbConnect = require("./config/dbUtils");
dbConnect.initDB();
const bodyParser = require("body-parser");
const authRouter = require("./route/auth_route");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRouter);

app.use((req, res, next) => {
    console.log("Hello from middleware");
    next();
});

process.on("SIGINT", () => {
    dbConnect.disconnectDB();
    console.log("Closing server");
    process.exit();
});

process.on("exit", () => {
    console.log("Server closed");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});