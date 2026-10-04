const ScoreMeter = ({ value = 0, label = 'Match score' }) => {
  const safe = Math.max(0, Math.min(100, Number(value) || 0))
  const tone = safe >= 80 ? 'high' : safe >= 60 ? 'mid' : 'low'

  return (
    <div
      className={`score score--${tone}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safe}
      aria-label={label}
    >
      <div className="score__header">
        <span>{label}</span>
        <span className="score__value">{safe}%</span>
      </div>
      <div className="score__track">
        <div className="score__fill" style={{ width: `${safe}%` }} />
      </div>
    </div>
  )
}

export default ScoreMeter
