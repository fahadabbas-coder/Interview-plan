const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist"]
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        expires: 0
    }
}, {
    timestamps: true
})

const tokenBlacklistModel=mongoose.model("blacklistToken",blacklistTokenSchema)

module.exports= tokenBlacklistModel