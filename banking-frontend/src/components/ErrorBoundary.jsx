import { Component } from "react";
import { TriangleAlert } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log for debugging; swap for a real logging service in production.
    console.error("Uncaught error in app:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <div className="state-box" style={{ paddingTop: "var(--space-7)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "var(--space-4)",
                color: "var(--danger)",
              }}
            >
              <TriangleAlert size={40} strokeWidth={1.5} />
            </div>
            <h3>Something went wrong</h3>
            <p>
              An unexpected error occurred. Try returning to the dashboard.
            </p>
            <button className="btn btn-secondary" onClick={this.handleReload}>
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
