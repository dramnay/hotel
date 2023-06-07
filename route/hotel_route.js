const express = require("express");
const router = express.Router();
const hotelController = require("../controller/hotel_controller");
const bookingController = require("../controller/booking_controller");
const { verifyToken, authorize } = require("../controller/auth_controller");

router
    .route("/")
    .post(verifyToken, authorize(["Admin"]), hotelController.createHotel);
router.route("/").get(verifyToken, hotelController.getAllHotels);
router
    .route("/:id")
    .delete(verifyToken, authorize(["Admin"]), hotelController.deleteHotel);
router
    .route("/:id")
    .patch(verifyToken, authorize(["Admin"]), hotelController.editHotel);
router.route("/:id").get(hotelController.getHotelById);
router.route("/:id/review").post(verifyToken, hotelController.createReview);
router.route("/:id/review").get(hotelController.getReviews);
router.get("/search/location/:location", hotelController.searchByLocation);
router.get(
    "/search/price/:minPrice/:maxPrice",
    hotelController.searchByPriceRange
);
router.get("/search/rating/:rating", hotelController.searchByRating);
// router.route("/:id/booking").post(hotelController.bookHotel);
router.post("/booking", verifyToken, bookingController.bookHotel);
router.delete(
    "/booking/:bookingId",
    verifyToken,
    bookingController.cancelBookedHotel
);

module.exports = router;