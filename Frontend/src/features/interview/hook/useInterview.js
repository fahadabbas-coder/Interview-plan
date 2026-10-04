import { generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf } from '../services/interview.api'
import { useCallback, useContext, useEffect } from 'react'
import { InterviewContext } from '../InterviewContext'
import { useParams } from 'react-router'
import { toastError } from '../../../utils/toast'

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider')
    }

    const { loading, setLoading, report, setReport } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            const data = response?.interviewReport ?? null
            setReport(data)
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getReportById = useCallback(async (id) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(id)
            const data = response?.interviewReport ?? null
            setReport(data)
            return data
        } catch (error) {
            toastError(error, "Unable to load this interview plan.")
            return null
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getReport = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            const data = response?.interviewReports ?? []
            setReport(data)
            return data
        } catch (error) {
            toastError(error, "Unable to load interview plans.")
            return []
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getResumePdf = useCallback(async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf(interviewReportId)
            if (!response) return
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReport()
        }
    }, [interviewId, getReportById, getReport])

    return { loading, report, getReport, generateReport, getReportById, getResumePdf }
}
