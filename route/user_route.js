const express = require("express");
const router = express.Router();
const { getUser } = require("../controller/user_controller.js");
const { verifyToken, authorize } = require("../controller/auth_controller.js");

router.route("/").get(verifyToken, authorize(["Admin"]), getUser);
module.exports = router;