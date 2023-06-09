const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const dbConnect = require("./config/dbUtils");
dbConnect.initDB();
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json");

const authRouter = require("./route/auth_route");
const hotelRouter = require("./route/hotel_route");
const userRouter = require("./route/user_route");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/user", userRouter);

app.use((req, res, next) => {
    console.log("Hello from middleware");
    next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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