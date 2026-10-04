import Logo from './Logo'

const AppShell = ({
  brand = 'Interview Plan',
  leading,
  title,
  actions,
  wide = false,
  children,
}) => (
  <div className="app-shell">
    <header className="topbar">
      <div className="topbar__start">
        {leading}
        <div className="topbar__identity">
          <Logo />
          <span className="topbar__brand">{brand}</span>
        </div>
        {title ? (
          <>
            <span className="topbar__divider" aria-hidden="true" />
            <span className="topbar__title" title={title}>
              {title}
            </span>
          </>
        ) : null}
      </div>
      {actions ? <div className="topbar__actions">{actions}</div> : null}
    </header>
    <main className={`app-main${wide ? ' app-main--wide' : ''}`}>
      {children}
    </main>
  </div>
)

export default AppShell
