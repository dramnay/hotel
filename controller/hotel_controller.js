const hotelService = require("../service/hotel_service");
const { Hotel } = require("../model/hotel_model");

exports.createHotel = async(req, res) => {
    try {
        const { name, images, mobile, description, price, location, amenities } =
        req.body;
        const user = req.loggedInUser;
        if (!user) {
            throw new Error("User not found");
        }
        const hotel = new Hotel({
            name,
            images,
            mobile,
            description,
            price,
            location,
            amenities,
            createdBy: user._id,
            updatedBy: user._id,
        });
        await hotelService.createHotel(hotel);

        res
            .status(201)
            .json({ id: hotel._id, message: "Hotel created successfully" });
    } catch (error) {
        console.log("error in create hotel ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.getAllHotels = async(req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    try {
        const hotels = await hotelService.getAllHotel(page, limit);
        return res.json(hotels);
    } catch (error) {
        console.log("error in getting hotels ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.getHotelById = async(req, res) => {
    try {
        const id = req.params.id;
        const hotel = await hotelService.getHotelById(id);
        if (!hotel) {
            res.status(404).send("Hotel not found");
        } else res.status(200).send(hotel);
    } catch (error) {
        console.log("error in getting hotel by id ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.createReview = async(req, res) => {
    try {
        const hotelId = req.params.id;
        const { comment, rating } = req.body;

        const userId = req.loggedInUser._id;

        const result = await hotelService.createReview(
            hotelId,
            userId,
            comment,
            rating
        );

        res.status(201).json({ message: result });
    } catch (error) {
        console.error("error occured in adding a review", error);
        res.status(400).json({ message: "Internal server error" });
    }
};

exports.deleteHotel = async(req, res) => {
    try {
        const hotelId = req.params.id;
        const userid = req.loggedInUser;
        const result = await hotelService.deleteHotel(hotelId, userid);
        res.status(200).send({ message: result });
    } catch (error) {
        console.log("error in deleting Hotel ", error);
        res.status(500).send({ message: error.message });
    }
};

exports.getReviews = async(req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await hotelService.getHotelById(hotelId);
        console.log(hotel.reviews);
        return res.status(200).json(hotel.reviews);
    } catch (error) {
        console.log("error in getting hotel ", error);
        res.status(400).send({ message: error.message });
    }
};