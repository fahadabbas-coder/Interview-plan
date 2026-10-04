const express = require("express")
const authMiddleware = require("../middlewares/auth")
const interviewController = require("../controllers/interview")
const upload = require("../middlewares/file")
const rateLimitMiddleware= require("../middlewares/ratelimit")

const interviewRouter = express.Router()


interviewRouter.post("/", authMiddleware.authUser,rateLimitMiddleware.PlanGenerationLimit, upload.single("resume"), interviewController.generateInterviewReportController)

interviewRouter.get("/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


module.exports = interviewRouter