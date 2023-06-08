const { Hotel } = require("../model/hotel_model");

exports.getAllHotel = async(page, limit, user) => {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (parsedPage < 0 || parsedLimit < 0)
        throw new Error(`Please enter a positive value for page number or limit`);

    const skipIndex = (parsedPage - 1) * parsedLimit;

    let pipeline = [{
            $project: {
                _id: 1,
                name: 1,
                images: 1,
                price: 1,
                description: 1,
                createdOn: 1,
                isActive: 1,
            },
        },
        { $skip: skipIndex },
        { $limit: parsedLimit },
    ];

    if (user.role !== "Admin") {
        pipeline.unshift({
            $match: {
                isActive: true,
            },
        });
    }

    const hotels = await Hotel.aggregate(pipeline);

    if (!hotels[0]) throw new Error("Hotel not found");

    return hotels;
};

exports.createHotel = async(hotel) => {
    console.log("In create Hotel ", hotel);
    await hotel.save();
    return hotel.id;
};

exports.getHotelById = async(user, id) => {
    const hotel = await Hotel.findById(id);
    console.log(hotel);
    return hotel;
};

exports.createReview = async(hotelId, user, comment, rating) => {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
        throw new Error("Hotel not found");
    }

    const review = { user: user._id, comment, rating };

    hotel.reviews.push(review);

    const totalReviews = hotel.reviews.length;
    const averageRating =
        (hotel.rating * (totalReviews - 1) + review.rating) / totalReviews;
    hotel.rating = averageRating;

    await Hotel.updateOne({ _id: hotelId }, { $set: hotel });

    return { message: "Review posted successfully" };
};

exports.deleteHotel = async(hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    if (hotel.isActive == false)
        throw new Error("hotel already removed from list");
    const deletedHotel = await Hotel.findByIdAndUpdate(hotelId, {
        isActive: false,
    });
    if (!deletedHotel) {
        console.log("Hotel not found");
        return { message: "Hotel do not exist" };
    } else return { message: "Hotel removed successfully from list" };
};

exports.editHotel = async(hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    if (hotel.isActive == true)
        throw new Error("Hotel already added to the list");
    const editHotel = await Hotel.findByIdAndUpdate(hotelId, {
        isActive: true,
    });
    if (!editHotel) {
        console.log("Hotel not found");
        return { message: "Hotel do not exist" };
    } else return { message: "Hotel added successfully to list" };
};