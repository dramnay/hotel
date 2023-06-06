const express = require("express");
const router = express.Router();
const { getUser } = require("../controller/user_controller.js");
const { verifyToken } = require("../controller/auth_controller.js");

router.route("/").get(verifyToken, getUser);
module.exports = router;