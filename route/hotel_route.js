const express = require("express");
const router = express.Router();
const hotelController = require("../controller/hotel_controller");
const { verifyToken } = require("../controller/auth_controller");

router.route("/").post(verifyToken, hotelController.createHotel);
router.route("/:id/review").post(verifyToken, hotelController.createReview);
router.route("/").get(hotelController.getAllHotels);
router.route("/:id").get(hotelController.getHotelById);
router.route("/:id").delete(verifyToken, hotelController.deleteHotel);
module.exports = router;