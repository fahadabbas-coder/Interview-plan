const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../model/blacklist")


async function authUser(req, res, next) {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: "Session Expair Please Login Again" })
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token
        })

        if (isTokenBlacklisted) {
            return res.status(401).json({ message: "Session Expair Please Login Again" })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            next()

        } catch (error) {
            return res.status(401).json({ message: "Session Expair Please Login Again" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { authUser }