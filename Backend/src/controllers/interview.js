const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai")
const interviewReportModel = require("../model/interviewReport")


async function generateInterviewReportController(req, res) {

    try {
        const resumeContent = await new pdfParse.PDFParse(Uint8Array.from(req.file.buffer)).getText()
        const { selfDescription, jobDescription } = req.body

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview Report Generated Successfully",
            interviewReport
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview Report Not Found" })
        }
        res.status(200).json({ message: "Interview Report Fetched Successfully", interviewReport })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({
            user: req.user.id
        }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan") // Exclude the resume, self-description, and job-description fields from the response
        res.status(200).json({ message: "Interview Reports Fetched Successfully", interviewReports })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const interviewReport = await interviewReportModel.findById(interviewReportId)
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview Report Not Found" })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=resume_report_${interviewReportId}.pdf`,
            'Content-Length': pdfBuffer.length
        })
        res.send(pdfBuffer)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }