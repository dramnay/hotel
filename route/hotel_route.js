const express = require("express");
const router = express.Router();
const hotelController = require("../controller/hotel_controller");
const { verifyToken } = require("../controller/auth_controller");

router.route("/").post(verifyToken, hotelController.createHotel);
router.route("/:id/review").post(verifyToken, hotelController.createReview);
router.route("/:id/review").get(hotelController.createReview);
router.route("/").get(hotelController.getAllHotels);
router.route("/:id").get(hotelController.getHotelById);
module.exports = router;