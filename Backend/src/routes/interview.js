const express = require("express")
const authMiddleware = require("../middlewares/auth")
const interviewController = require("../controllers/interview")
const interviewValidatorMiddleware = require("../middlewares/interview.validators")
const { upload, handleMulterError, checkFileUpload } = require("../middlewares/file")
const rateLimitMiddleware = require("../middlewares/ratelimit")

const interviewRouter = express.Router()


interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), handleMulterError, checkFileUpload, interviewValidatorMiddleware.generateInterviewReport, rateLimitMiddleware.PlanGenerationLimit, interviewController.generateInterviewReportController)

interviewRouter.get("/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


module.exports = interviewRouter