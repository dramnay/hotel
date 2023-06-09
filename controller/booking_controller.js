const bookingService = require("../service/booking_service");
const hotelService = require("../service/hotel_service");

exports.bookHotel = async(req, res) => {
    try {
        const hotelId = req.params.id;
        const { checkInDate, checkOutDate, rooms } = req.body;
        const user = req.loggedInUser;

        const hotel = await hotelService.getHotelById(user, hotelId);
        const booking = await bookingService.bookHotel(
            hotelId,
            user,
            checkInDate,
            checkOutDate,
            rooms
        );

        res.status(200).json({ booking });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error.message });
    }
};

exports.cancelBookedHotel = async(req, res) => {
    try {
        const { bookingId } = req.params;

        const canceledBooking = await bookingService.cancelBookedHotel(bookingId);

        if (canceledBooking) {
            res.status(200).json({ message: "Booking canceled successfully." });
        } else {
            res.status(404).json({ error: "Booking not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error.message });
    }
};