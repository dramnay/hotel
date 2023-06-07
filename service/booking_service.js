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

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        throw new Error("Hotel not found.");
    }

    const availableRooms = hotel.noOfRooms - bookedRooms;
    if (rooms > availableRooms) {
        throw new Error(`Only ${availableRooms} room(s) available `);
    }

    const newBooking = new Booking({
        hotel: hotelId,
        user: userId,
        checkInDate,
        checkOutDate,
        rooms,
    });

    const savedBooking = await newBooking.save();

    hotel.availableRooms = availableRooms - rooms;
    await hotel.save();

    return savedBooking;
};

exports.cancelBookedHotel = async(bookingId) => {
    const canceledBooking = await Booking.findByIdAndDelete(bookingId);

    if (canceledBooking) {
        const { hotel, rooms } = canceledBooking;

        const hotelToUpdate = await Hotel.findById(hotel);

        if (hotelToUpdate) {
            hotelToUpdate.availableRooms += rooms;
            await hotelToUpdate.save();
        }

        return canceledBooking;
    }

    return null;
};