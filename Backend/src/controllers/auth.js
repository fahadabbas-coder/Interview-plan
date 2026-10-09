const userModel = require("../model/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const tokenBlacklistModel = require("../model/blacklist")
const otpModel = require("../model/otp")
const forgetModel = require("../model/forget.js")
const sendEmail = require("../services/email.js")
const { generateOtp, getOtpHtml, getResPasswordOtpHtml, getPasswordChangedHtml } = require("../utils/utils")


async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { username }, { email }
            ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exist with this email or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        const otp = generateOtp()
        const html = getOtpHtml(otp)

        const otpHash = await bcrypt.hash(otp, 10)

        await otpModel.deleteMany({ email })
        await otpModel.create({ email, user: user._id, otpHash })

        await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html)

        res.status(201).json({
            message: "Account Created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function verifyEmail(req, res) {
    try {
        const { otp, email } = req.body

        const otpDoc = await otpModel.findOne({ email })

        if (!otpDoc || Date.now() > otpDoc.createdAt.getTime() + 60 * 60 * 1000) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        const isMatch = await bcrypt.compare(otp, otpDoc.otpHash)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
        const user = await userModel.findByIdAndUpdate(
            otpDoc.user,
            { verified: true },
            { returnDocument: "after" }
        )
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await otpModel.deleteMany({
            user: otpDoc.user
        })
        res.status(200).json({
            message: "Email Verified Successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function resendOtp(req, res) {
    try {
        const { email } = req.query

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.verified) {
            return res.status(400).json({ message: "Email already verified" })
        }

        const recentOtp = await otpModel.findOne({ user: user._id })
        if (recentOtp && Date.now() - recentOtp.createdAt < 60 * 1000) {
            return res.status(429).json({
                message: "Please wait 60 seconds before requesting a new OTP"
            })
        }

        await otpModel.deleteMany({ user: user._id })

        const otp = generateOtp()
        const html = getOtpHtml(otp)
        const otpHash = await bcrypt.hash(otp, 10)
        await otpModel.create({
            email,
            user: user._id,
            otpHash
        })

        await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html)

        res.status(200).json({ message: "OTP sent successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invaild username or password" })
        }

        const isPasswordVaild = await bcrypt.compare(password, user.password)

        if (!isPasswordVaild) {
            return res.status(400).json({ message: "Invaild username or password" })
        }

        if (!user.verified) {

            const otp = generateOtp()
            const html = getOtpHtml(otp)
            const otpHash = await bcrypt.hash(otp, 10)

            await otpModel.deleteMany({ email })
            await otpModel.create({ email, user: user._id, otpHash })

            await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html)

            return res.status(403).json({ message: "Please Verify your Email" })
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token
            , {
                httpOnly: true,
                sameSite: "lax",
                secure: true,
                path: "/"
            }
        )

        res.status(200).json({
            message: "Login Sccessfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function forgetPassword(req, res) {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User Invaild" })
        }

        const recentOtp = await forgetModel.findOne({ user: user._id })
        if (recentOtp && Date.now() - recentOtp.createdAt < 60 * 1000) {
            return res.status(429).json({
                message: "Please wait 60 seconds before requesting a new OTP"
            })
        }

        await forgetModel.deleteMany({ user: user._id })

        const otp = generateOtp()
        const html = getResPasswordOtpHtml(otp)
        const otpHash = await bcrypt.hash(otp, 10)

        await forgetModel.create({
            email,
            user: user._id,
            otpHash
        })

        await sendEmail(email, "Forget Password", `Your OTP code is ${otp}`, html)

        res.status(200).json({
            message: "OTP Send Successfully",
            user: {
                email: user.email
            }
        })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body

        const otpDoc = await forgetModel.findOne({ email })

        if (!otpDoc) {
            return res.status(400).json({ message: "User Invaild" })
        }

        const isMatch = await bcrypt.compare(otp, otpDoc.otpHash)

        if (!isMatch) {
            return res.status(400).json({ message: "Enter Correct OTP" })
        }

        const resetToken = jwt.sign({
            userId: otpDoc.user
        }, process.env.JWT_RESET_SECRET, {
            expiresIn: "5m"
        })

        res.cookie("resetToken", resetToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/api/auth/reset-password"
        })

        res.status(200).json({
            message: "Rest your Password"
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function resetPassword(req, res) {
    try {
        const resetToken = req.cookies.resetToken
        const { newPassword, confirmPassword } = req.body

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" })
        }
        let decoded
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);
        } catch (err) {
            return res.status(401).json({
                message: 'Reset Session Invalid or Expire'
            });
        }

        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword

        await user.save();

        await forgetModel.deleteMany({ user: user._id });

        const html = getPasswordChangedHtml()

        await sendEmail(user.email, "Password Changed Successfully", "Your Password Changed Successfully", html)

        return res.status(200).json({
            message: 'Password Update Successfully'
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function logoutUser(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/"
        })

        res.status(200).json({ message: "Logout Successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "user details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = { registerUser, verifyEmail, resendOtp, loginUser, forgetPassword, verifyOtp, resetPassword, logoutUser, getMe }
