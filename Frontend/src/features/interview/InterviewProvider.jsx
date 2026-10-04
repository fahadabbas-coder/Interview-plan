import { useState } from "react"
import { InterviewContext } from "./InterviewContext"

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState([])

    return (
        <InterviewContext.Provider
            value={{ loading, setLoading, report, setReport }}
        >
            {children}
        </InterviewContext.Provider>
    )
}
