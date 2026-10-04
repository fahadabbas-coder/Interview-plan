import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hook/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'
import AppShell from '../../../components/ui/AppShell'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { toastSuccess, toastError } from '../../../utils/toast'
import '../style/home.css'

const Home = () => {
    const { loading, report, generateReport } = useInterview()
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const reports = Array.isArray(report) ? report : []
    const canGenerate = jobDescription.trim().length > 0 && (Boolean(resumeFile) || selfDescription.trim().length > 0)

    const handleGenerate = async () => {
        if (!canGenerate || submitting) return

        setSubmitting(true)
        try {
            const response = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile,
            })
            if (response?.interviewReport?._id) {
                toastSuccess(response)
                navigate(`/interview/${response.interviewReport._id}`)
            } else {
                toastError(null, "Unable to generate your interview plan.")
            }
        } catch (error) {
            toastError(error, "Unable to generate your interview plan.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleSignOut = async () => {
        try {
            const response = await handleLogout()
            toastSuccess(response)
        } catch (error) {
            toastError(error, "Unable to sign out.")
        } finally {
            navigate('/login')
        }
    }

    return (
        <AppShell
            actions={
                <>
                    <span className="topbar__user">
                        {user?.username || user?.email || "Candidate"}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                        Sign out
                    </Button>
                </>
            }
        >
            <div className="home-header">
                <h1 className="home-title">Build your interview plan</h1>
                <p className="home-subtitle">
                    Paste a role, add your profile, and get a focused preparation plan.
                </p>
            </div>

            <section className="panel plan-panel" aria-labelledby="plan-title">
                <h2 id="plan-title" className="visually-hidden">Create interview plan</h2>
                <form
                    className="plan-form"
                    onSubmit={(event) => {
                        event.preventDefault()
                        handleGenerate()
                    }}
                >
                    <div className="plan-grid">
                        <div className="plan-section">
                            <div className="plan-section__header">
                                <span className="plan-section__icon" aria-hidden="true">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                </span>
                                <h3 className="plan-section__title">Target role</h3>
                                <Badge tone="accent">Required</Badge>
                            </div>

                            <div className="field">
                                <label className="visually-hidden" htmlFor="jobDescription">
                                    Job description
                                </label>
                                <textarea
                                    id="jobDescription"
                                    className="textarea"
                                    maxLength={5000}
                                    value={jobDescription}
                                    onChange={(event) => setJobDescription(event.target.value)}
                                    placeholder="Paste the full job description here."
                                />
                                <div className="field__meta">
                                    <span>Use the exact role text for better questions.</span>
                                    <span>{jobDescription.length} / 5000</span>
                                </div>
                            </div>
                        </div>

                        <div className="plan-section plan-section--profile">
                            <div className="plan-section__header">
                                <span className="plan-section__icon" aria-hidden="true">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <h3 className="plan-section__title">Your profile</h3>
                                <Badge tone="info">Recommended</Badge>
                            </div>

                            <div className="field">
                                <label className="dropzone" htmlFor="resume">
                                    <span className="dropzone__icon" aria-hidden="true">
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="16 16 12 12 8 16" />
                                            <line x1="12" y1="12" x2="12" y2="21" />
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                        </svg>
                                    </span>
                                    <span className="dropzone__title">Add resume</span>
                                    <span className="dropzone__subtitle">PDF, max 3MB</span>
                                    {resumeFile ? (
                                        <span className="dropzone__file">{resumeFile.name}</span>
                                    ) : null}
                                    <input
                                        id="resume"
                                        ref={fileInputRef}
                                        className="visually-hidden"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                                    />
                                </label>
                            </div>

                            <div className="plan-divider" aria-hidden="true">
                                <span>Or</span>
                            </div>

                            <div className="field">
                                <label className="field__label" htmlFor="selfDescription">
                                    Self description
                                </label>
                                <textarea
                                    id="selfDescription"
                                    className="textarea textarea--short"
                                    value={selfDescription}
                                    onChange={(event) => setSelfDescription(event.target.value)}
                                    placeholder="Summarize experience, skills, and years in role."
                                />
                            </div>

                            <div className="note">
                                <span className="note__icon" aria-hidden="true">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 16v-4" />
                                        <path d="M12 8h0.01" />
                                    </svg>
                                </span>
                                <p>
                                    Add a resume or self description so the plan can match your background.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="plan-footer">
                        <span className="plan-footer__note">Takes about 30 seconds</span>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={submitting}
                            disabled={!canGenerate}
                        >
                            {submitting ? "Generating plan" : "Generate plan"}
                        </Button>
                    </div>
                </form>
            </section>

            <section className="reports" aria-labelledby="reports-title">
                <h2 id="reports-title" className="reports__title">Recent plans</h2>

                {loading && reports.length === 0 ? (
                    <div className="reports__list" aria-hidden="true">
                        <div className="skeleton skeleton-row" />
                        <div className="skeleton skeleton-row" />
                    </div>
                ) : reports.length > 0 ? (
                    <ul className="reports__list">
                        {reports.map((item) => {
                            const score = Number(item.matchScore) || 0
                            const tone = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'

                            return (
                                <li key={item._id}>
                                    <Button
                                        className="report-row"
                                        onClick={() => navigate(`/interview/${item._id}`)}
                                        aria-label={`Open ${item.title || "untitled plan"}`}
                                    >
                                        <span className="report-row__main">
                                            <span className="report-row__title">
                                                {item.title || "Untitled plan"}
                                            </span>
                                            <span className="report-row__meta">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </span>
                                        <span className={`report-row__score report-row__score--${tone}`}>
                                            {score}% match
                                        </span>
                                    </Button>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="panel empty-state">
                        <p className="empty-state__title">No plans yet</p>
                        <p>Your generated interview plans appear here.</p>
                    </div>
                )}
            </section>
        </AppShell>
    )
}

export default Home
