const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel