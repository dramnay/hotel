const Booking = require("../model/booking_model");
const { Hotel } = require("../model/hotel_model");
exports.bookHotel = async(
    hotelId,
    userId,
    checkInDate,
    checkOutDate,
    rooms
) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn.getTime() === checkOut.getTime()) {
        throw new Error("Check-in and check-out dates cannot be the same.");
    }

    const existingBookings = await Booking.find({
        hotel: hotelId,
        $or: [{
                checkInDate: { $lte: checkInDate },
                checkOutDate: { $gt: checkInDate },
            },
            {
                checkInDate: { $lt: checkOutDate },
                checkOutDate: { $gte: checkOutDate },
            },
        ],
    });

    const bookedRooms = existingBookings.reduce(
        (total, booking) => total + booking.rooms,
        0
    );
    console.log(bookedRooms);

    const hotel = await Hotel.findById(hotelId);
    console.log(hotel);
    if (!hotel) {
        throw new Error("Hotel not found.");
    }

    if (bookedRooms + rooms > hotel.availableRooms) {
        throw new Error("Insufficient rooms available for the specified dates.");
    }

    const newBooking = new Booking({
        hotel: hotelId,
        user: userId,
        checkInDate,
        checkOutDate,
        rooms,
    });

    const savedBooking = await newBooking.save();

    return savedBooking;
};