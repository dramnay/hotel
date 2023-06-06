const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        // required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    amenities: {
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
    },
    numReviews: {
        type: Number,
    },
    reviews: [reviewSchema],
    createdOn: {
        type: Date,
        default: Date.now(),
        immutable: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true,
    },
}, {
    timestamps: true,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = { Hotel };