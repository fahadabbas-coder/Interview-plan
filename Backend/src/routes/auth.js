const { Router } = require("express")
const authController = require("../controllers/auth")
const authMiddlewares = require("../middlewares/auth")
const authValidatorsMiddleware = require("../middlewares/auth.validators")
const rateLimitMiddleware =require("../middlewares/ratelimit")

const authRouter = Router()


authRouter.post("/register", authValidatorsMiddleware.registerValidator, authController.registerUser)

authRouter.post("/verify-email", authValidatorsMiddleware.verifyEmailValidator,rateLimitMiddleware.verifyEmailLimit , authController.verifyEmail)

authRouter.get("/resend-otp", authValidatorsMiddleware.resendOtpValidator,rateLimitMiddleware.resendOtpLimit, authController.resendOtp)

authRouter.post("/forget-password", authValidatorsMiddleware.forgetPasswordValidator,rateLimitMiddleware.forgetPasswordLimit, authController.forgetPassword)

authRouter.post("/verify-otp", authValidatorsMiddleware.verifyOtpValidator,rateLimitMiddleware.verifyOtpLimit, authController.verifyOtp)

authRouter.post("/reset-password", authValidatorsMiddleware.resetPasswordValidator, authController.resetPassword)

authRouter.post("/login", authValidatorsMiddleware.loginValidator,rateLimitMiddleware.loginLimiter, authController.loginUser)

authRouter.get("/logout", authController.logoutUser)

authRouter.post("/get-me", authMiddlewares.authUser, authController.getMe)



module.exports = authRouter