const { body, query, validationResult } = require("express-validator")

function checkErrors(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed", errors: errors.array().map(e => ({ field: e.path, msg: e.msg }))
        })
    }
    next()
}

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

const registerValidator = [
    body("username").trim().isLength({ min: 4 }).withMessage("Username must be 4+ characters"),
    body("email").isEmail().withMessage("Enter Valid Email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password required").isLength({ min: 8 }).withMessage("Password 8+ chars").matches(strongPassword).withMessage("Password needs upper, lower, number, special char"),
    checkErrors
]

const loginValidator = [
    body("email").isEmail().withMessage("Enter Valid Email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password required"),
    checkErrors
]

const verifyEmailValidator = [
    body("email").isEmail().withMessage("Enter Valid Email").normalizeEmail(),
    body("otp").isLength({ min: 6, max: 6 }).isNumeric().withMessage("Enter 6-digit OTP"),
    checkErrors
]

const resendOtpValidator = [
    query("email").isEmail().withMessage("Enter Valid Email"),
    checkErrors
]

const forgetPasswordValidator = [
    body("email").isEmail().withMessage("Enter Valid Email").normalizeEmail(),
    checkErrors
]

const verifyOtpValidator = [
    body("email").isEmail().withMessage("Enter Valid Email").normalizeEmail(),
    body("otp").isLength({ min: 6, max: 6 }).isNumeric().withMessage("Enter 6-digit OTP"),
    checkErrors
]

const resetPasswordValidator = [
    body("newPassword").notEmpty().withMessage("Enter New password").isLength({ min: 8 }).withMessage("Password 8+ chars").matches(strongPassword).withMessage("Password needs upper, lower, number, special char"),
    body("confirmPassword").custom((v, { req }) => {
        if (!v) throw new Error("Enter Confirm password")
        if (v !== req.body.newPassword) throw new Error("Passwords do not match")
        return true
    }),
    checkErrors
]

module.exports = { registerValidator, loginValidator, verifyEmailValidator, resendOtpValidator, forgetPasswordValidator, verifyOtpValidator, resetPasswordValidator }