import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_ORIGIN_URL,
    withCredentials: true,
})

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (!error.response) {
            const networkErr = new Error("Unable to reach the Server. Please check your connection and try again.");
            networkErr.cause = error;
            return Promise.reject(networkErr)
        }
        return Promise.reject(error)
    }
)

export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile}) =>{

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }

    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data;
}

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}`);
    return response.data;
}

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview");
    return response.data;
}

export const generateResumePdf = async (interviewReportId) => {
    try {
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
            responseType: 'blob'
        })
        return response.data
    } catch (error) {
        const responseBody = error.response?.data
        if (responseBody instanceof Blob) {
            let payload
            try {
                payload = JSON.parse(await responseBody.text())
            } catch {
                payload = null
            }
            if (payload?.message) {
                throw new Error(payload.message, { cause: error })
            }
        }
        throw error
    }

}