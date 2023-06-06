const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        immutable: true,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(password) {
                var re =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return re.test(password);
            },
            message: (props) =>
                `${props.value} need to be atleast 8 characters long contains at least a uppercase char, a lowercase char, a number and a special character(@$!%*?&)`,
        },
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    },
    mobile: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    mobileVerified: {
        type: Boolean,
        default: false,
    },
});

UserSchema.pre("save", async function(next) {
    const encryptedPassword = await hashPassword(this.password);
    this.password = encryptedPassword;
    next();
});

const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);