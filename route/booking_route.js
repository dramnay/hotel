const express = require("express");
const bookingController = require("../controller/booking_controller");

const router = express.Router();

// Route for booking a hotel
router.post("/book", bookingController.bookHotel);

module.exports = router;