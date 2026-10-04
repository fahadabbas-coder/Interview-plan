const mongoose = require("mongoose")

const forgetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"]
    },
    otpHash: {
        type: String,
        required: [true, "OTP is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600  // 10 minutes baad auto delete
    }
}, {
    timestamps: true
})

const forgetModel = mongoose.model("forget", forgetSchema)

module.exports = forgetModel