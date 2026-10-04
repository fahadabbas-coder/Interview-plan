const { rateLimit, ipKeyGenerator } = require("express-rate-limit")

const loginLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 15,
    keyGenerator: (req) => `${req.body.email}-${ipKeyGenerator(req.ip)}`,
    message: { message: "Too many attempts, Please try again later" }
})

const verifyEmailLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 4,
    keyGenerator: (req) => `${req.body.email}-${ipKeyGenerator(req.ip)}`,
    message: { message: "Too many attempts, Please try again later" }
})

const resendOtpLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 4,
    keyGenerator: (req) => `${req.query.email}-${ipKeyGenerator(req.ip)}`,
    message: { message: "Too many attempts, Please try again later" }
})

const forgetPasswordLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 5,
    keyGenerator: (req) => `${req.body.email}-${ipKeyGenerator(req.ip)}`,
    message: { message: "Too many attempts, Please try again later" }
})

const verifyOtpLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 5,
    keyGenerator: (req) => `${req.body.email}-${ipKeyGenerator(req.ip)}`,
    message: { message: "Too many attempts, Please try again later" }
})

const PlanGenerationLimit = rateLimit({
    windowMs: 12 * 60 * 60 * 1000,
    limit: 8,
    keyGenerator: (req) => `${req.user.id}`,
    message: { message: "You've hit the usage limit. Please try again after 12 hours..." }
})

module.exports = { loginLimiter, verifyEmailLimit, resendOtpLimit, forgetPasswordLimit, verifyOtpLimit, PlanGenerationLimit }