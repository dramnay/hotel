const hotelService = require("../service/hotel_service");
const { Hotel } = require("../model/hotel_model");

exports.createHotel = async(req, res) => {
    try {
        const {
            name,
            images,
            mobile,
            description,
            price,
            location,
            noOfRooms,
            amenities,
            rating,
        } = req.body;
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
            noOfRooms,
            rating,
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
    const token = req.headers["authorization"];
    try {
        const hotels = await hotelService.getAllHotel(token);
        return res.json(hotels);
    } catch (error) {
        console.log("error in getting hotels ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.getHotelById = async(req, res) => {
    try {
        const id = req.params.id;
        const user = req.loggedInUser;
        const hotel = await hotelService.getHotelById(user, id);
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

        const user = req.loggedInUser;

        const hotel = await hotelService.getHotelById(user, hotelId);
        const result = await hotelService.createReview(
            hotelId,
            user,
            comment,
            rating
        );

        res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
        console.error("error occured in adding a review", error);
        res.status(400).send({ message: error.message });
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
        res.status(400).send({ message: error.message });
    }
};

exports.getReviews = async(req, res) => {
    try {
        const hotelId = req.params.id;
        const user = req.loggedInUser;
        const hotel = await hotelService.getHotelById(user, hotelId);
        console.log(hotel);
        return res.status(200).json(hotel.reviews);
    } catch (error) {
        console.log("error in getting hotel ", error);
        res.status(400).send({ message: error.message });
    }
};

exports.searchByLocation = async(req, res) => {
    try {
        const { location } = req.params;
        const hotels = await Hotel.find({ location });
        res.json(hotels);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.searchByPriceRange = async(req, res) => {
    try {
        const { minPrice, maxPrice } = req.params;
        if (Number(minPrice) > Number(maxPrice))
            throw new Error("min price should be smaller");
        const hotels = await Hotel.find({
            price: { $gte: minPrice, $lte: maxPrice },
        });
        res.json(hotels);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.searchByRating = async(req, res) => {
    try {
        const { rating } = req.params;
        const hotels = await Hotel.find({ rating: { $gte: rating } });
        res.json(hotels);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.editHotel = async(req, res) => {
    try {
        const hotelId = req.params.id;
        const userid = req.loggedInUser;
        const result = await hotelService.editHotel(hotelId, userid);
        res.status(200).send({ message: result });
    } catch (error) {
        console.log("error in deleting Hotel ", error);
        res.status(400).send({ message: error.message });
    }
};