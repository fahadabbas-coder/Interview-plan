import AppShell from "./AppShell";
import Button from "./Button";
import Logo from "./Logo";

const NotFound = () => {
    return (
        <AppShell
            leading={<Button to="/" variant="ghost" size="sm">Back to Home</Button>}
            title="404"
        >
            <div className="panel empty-state" style={{ textAlign: "center" }}>
                <Logo />
                <h1 className="empty-state__title">Page not found</h1>
                <p>
                    The page you are looking for does not exist.
                </p>
                <Button
                    to="/"
                    variant="primary"
                    size="sm"
                    style={{ marginTop: "16px", display: "inline-flex" }}
                >
                    Go to Dashboard
                </Button>
            </div>
        </AppShell>
    );
};

export default NotFound