const bookingService = require("../service/booking_service");

exports.bookHotel = async(req, res) => {
    try {
        const { hotelId, userId, checkInDate, checkOutDate, rooms } = req.body;

        const booking = await bookingService.bookHotel(
            hotelId,
            userId,
            checkInDate,
            checkOutDate,
            rooms
        );

        res.status(200).json({ booking });
    } catch (error) {
        console.error(error);
        res
            .status(400)
            .json({ error: "An error occurred while booking the hotel." });
    }
};