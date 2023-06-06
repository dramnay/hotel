const mongoose = require("mongoose");
const User = require("../model/user_model");

exports.getUserfromDB = async() => {
    return await User.find();
};