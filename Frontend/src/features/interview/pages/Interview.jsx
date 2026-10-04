import { useState } from 'react'
import { useParams } from 'react-router'
import { useInterview } from "../hook/useInterview"
import AppShell from "../../../components/ui/AppShell"
import Button from "../../../components/ui/Button"
import Loader from "../../../components/ui/Loader"
import ScoreMeter from "../../../components/ui/ScoreMeter"
import { toastError } from "../../../utils/toast"
import '../style/interview.css'

const SECTIONS = [
    {
        id: 'technical',
        label: 'Technical',
        icon: (
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
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        id: 'behavioral',
        label: 'Behavioral',
        icon: (
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'roadmap',
        label: 'Roadmap',
        icon: (
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
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        ),
    },
]

const QuestionCard = ({ item, index, panelId }) => {
    const [open, setOpen] = useState(false)
    const triggerId = `question-trigger-${panelId}-${index}`
    const regionId = `question-panel-${panelId}-${index}`

    return (
        <div className="question">
            <button
                id={triggerId}
                className="question__trigger"
                aria-expanded={open}
                aria-controls={regionId}
                onClick={() => setOpen((current) => !current)}
            >
                <span className="question__index">Q{index + 1}</span>
                <span className="question__text">{item.question}</span>
                <span className="question__chevron" aria-hidden="true">
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
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {open ? (
                <div
                    id={regionId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="question__panel"
                >
                    <div className="question__section">
                        <span className="question__tag question__tag--intention">Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="question__section">
                        <span className="question__tag question__tag--answer">Model answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <article className="roadmap__day">
        <div className="roadmap__marker" aria-hidden="true">
            {day.day}
        </div>
        <div>
            <div className="roadmap__header">
                <span className="roadmap__day-label">Day {day.day}</span>
                <h3 className="roadmap__focus">{day.focus}</h3>
            </div>
            <ul className="roadmap__tasks">
                {day.tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                ))}
            </ul>
        </div>
    </article>
)

const Interview = () => {
    const [active, setActive] = useState('technical')
    const [downloading, setDownloading] = useState(false)
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    const handleDownload = async () => {
        if (!interviewId || downloading) return

        setDownloading(true)
        try {
            await getResumePdf(interviewId)
        } catch (error) {
            toastError(error, "Unable to download the resume.")
        } finally {
            setDownloading(false)
        }
    }

    if (loading && !report) {
        return (
            <Loader
                title="Loading plan"
                subtitle="Preparing your interview material"
            />
        )
    }

    if (!report) {
        return (
            <AppShell
                leading={<Button to="/" variant="ghost" size="sm">Back</Button>}
                title="Plan unavailable"
            >
                <div className="panel empty-state">
                    <p className="empty-state__title">This plan is unavailable</p>
                    <p>It may have been removed or the link is incorrect.</p>
                    <Button to="/" variant="primary">Back to plans</Button>
                </div>
            </AppShell>
        )
    }

    const score = Number(report.matchScore) || 0
    const technicalQuestions = report.technicalQuestions ?? []
    const behavioralQuestions = report.behavioralQuestions ?? []
    const preparationPlan = report.preparationPlan ?? []
    const skillGaps = report.skillGaps ?? []

    return (
        <AppShell
            wide
            leading={
                <Button to="/" variant="ghost" size="sm" aria-label="Back to plans">
                    Plans
                </Button>
            }
            title={report.title || "Interview plan"}
            actions={
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    loading={downloading}
                >
                    {downloading ? "Preparing PDF" : "Download resume"}
                </Button>
            }
        >
            <div className="interview-layout">
                <nav className="section-nav" aria-label="Plan sections">
                    <p className="section-nav__label">Sections</p>
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            className="nav-item"
                            aria-pressed={active === section.id}
                            onClick={() => setActive(section.id)}
                        >
                            <span className="nav-item__icon" aria-hidden="true">
                                {section.icon}
                            </span>
                            {section.label}
                        </button>
                    ))}
                </nav>

                <section className="interview-content" aria-busy={loading}>
                    {active === 'technical' && (
                        <>
                            <div className="content-header">
                                <h2 className="content-header__title">Technical questions</h2>
                                <span className="content-count">
                                    {technicalQuestions.length} questions
                                </span>
                            </div>
                            {technicalQuestions.length > 0 ? (
                                <div className="question-list">
                                    {technicalQuestions.map((item, index) => (
                                        <QuestionCard
                                            key={index}
                                            item={item}
                                            index={index}
                                            panelId="technical"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="panel empty-state">
                                    <p className="empty-state__title">No technical questions</p>
                                    <p>This plan does not include technical questions.</p>
                                </div>
                            )}
                        </>
                    )}

                    {active === 'behavioral' && (
                        <>
                            <div className="content-header">
                                <h2 className="content-header__title">Behavioral questions</h2>
                                <span className="content-count">
                                    {behavioralQuestions.length} questions
                                </span>
                            </div>
                            {behavioralQuestions.length > 0 ? (
                                <div className="question-list">
                                    {behavioralQuestions.map((item, index) => (
                                        <QuestionCard
                                            key={index}
                                            item={item}
                                            index={index}
                                            panelId="behavioral"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="panel empty-state">
                                    <p className="empty-state__title">No behavioral questions</p>
                                    <p>This plan does not include behavioral questions.</p>
                                </div>
                            )}
                        </>
                    )}

                    {active === 'roadmap' && (
                        <>
                            <div className="content-header">
                                <h2 className="content-header__title">Preparation roadmap</h2>
                                <span className="content-count">
                                    {preparationPlan.length}-day plan
                                </span>
                            </div>
                            {preparationPlan.length > 0 ? (
                                <div className="roadmap">
                                    {preparationPlan.map((day) => (
                                        <RoadMapDay key={day.day} day={day} />
                                    ))}
                                </div>
                            ) : (
                                <div className="panel empty-state">
                                    <p className="empty-state__title">No roadmap yet</p>
                                    <p>This plan does not include a preparation roadmap.</p>
                                </div>
                            )}
                        </>
                    )}
                </section>

                <aside className="summary" aria-label="Plan summary">
                    <div className="panel summary__panel">
                        <p className="summary__label">Readiness</p>
                        <ScoreMeter value={score} />
                    </div>
                    <div className="panel summary__panel">
                        <p className="summary__label">Skill gaps</p>
                        {skillGaps.length > 0 ? (
                            <div className="tags">
                                {skillGaps.map((gap, index) => (
                                    <span key={index} className={`tag tag--${gap.severity}`}>
                                        {gap.skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="summary__empty">No major gaps detected</p>
                        )}
                    </div>
                </aside>
            </div>
        </AppShell>
    )
}

export default Interview
