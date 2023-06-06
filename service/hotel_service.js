const { Hotel } = require("../model/hotel_model");

exports.getAllHotel = async(page, limit) => {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (parsedPage < 0 || parsedLimit < 0)
        throw new Error(`Please enter a positive value for page number or limit`);

    const skipIndex = (parsedPage - 1) * parsedLimit;

    const hotels = await Hotel.aggregate([{
            $project: {
                _id: 1,
                name: 1,
                images: 1,
                price: 1,
                description: 1,
                createdOn: 1,
            },
        },
        { $skip: skipIndex },
        { $limit: parsedLimit },
    ]);

    if (!hotels[0]) throw new Error("Hotel not found");

    return hotels;
};

exports.createHotel = async(hotel) => {
    console.log("In create Hotel ", hotel);
    await hotel.save();
    return hotel.id;
};

exports.getHotelById = async(id) => {
    const hotel = await Hotel.findById(id);
    if (hotel.isActive == false) {
        throw new Error("Hotel is inactive");
    }
    console.log(hotel);
    return hotel;
};

exports.createReview = async(productId, userId, comment, rating) => {
    try {
        const hotel = await Hotel.findById(productId);

        if (!hotel) {
            throw new Error("Product not found");
        }

        const review = { user: userId, comment, rating };

        hotel.reviews.push(review);

        const totalReviews = hotel.reviews.length;
        const averageRating =
            (hotel.rating * (totalReviews - 1) + review.rating) / totalReviews;
        hotel.rating = averageRating;

        await Hotel.updateOne({ _id: productId }, { $set: hotel });

        return { message: "Review posted successfully" };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to post review");
    }
};

exports.deleteHotel = async(hotelId, userId) => {
    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel.createdBy == userId)
            throw new Error("Not authorized to delete hotel");
        const deletedHotel = await Hotel.findByIdAndUpdate(hotelId, {
            isActive: false,
        });
        if (!deletedHotel) {
            console.log("Hotel not found");
            return { message: "Hotel do not exist" };
        } else return { message: "Hotel removed successfully from list" };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete Hotel");
    }
};