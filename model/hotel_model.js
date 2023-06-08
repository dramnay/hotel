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
        trim: true,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Please enter a valid mobile number."],
    },
    images: {
        type: Array,
        required: true,
        of: String,
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
        type: Array,
        required: true,
        of: String,
    },
    rating: {
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
    noOfRooms: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = { Hotel };