const Loader = ({ title = 'Loading', subtitle }) => (
  <main className="loader-screen" role="status" aria-live="polite">
    <span className="spinner spinner--lg" aria-hidden="true" />
    <div>
      <p className="loader__title">{title}</p>
      {subtitle ? <p className="loader__subtitle">{subtitle}</p> : null}
    </div>
  </main>
)

export default Loader
