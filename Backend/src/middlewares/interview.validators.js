const { body, validationResult } = require("express-validator")


function checkErrors(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed", errors: errors.array().map(e => ({ field: e.path, msg: e.msg }))
        })
    }
    next()
}

const generateInterviewReport = [
    body("jobDescription").notEmpty().withMessage("Target Role required").isLength({ max: 500 }).withMessage("Target Role must not exceed 500 characters"),
    body("selfDescription").notEmpty().withMessage("SelfDescription is required").isLength({ max: 150 }).withMessage("Self Description must not exceed 150 characters"),
    checkErrors
]

module.exports = { generateInterviewReport }