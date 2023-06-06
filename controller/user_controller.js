const mongoose = require("mongoose");
const User = require("../model/user_model");
const UserService = require("../service/user_service");

exports.getUser = async(req, res) => {
    try {
        const result = await UserService.getUserfromDB();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message,
        });
    }
};