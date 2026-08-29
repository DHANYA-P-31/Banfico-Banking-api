import { Link } from "react-router-dom";
import { SearchX, Home } from "lucide-react";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <div className="page">
      <div className="state-box" style={{ paddingTop: "var(--space-7)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "var(--space-4)",
            color: "var(--text-faint)",
          }}
        >
          <SearchX size={40} strokeWidth={1.5} />
        </div>
        <h3>Page not found</h3>
        <p>The page you're looking for doesn't exist or was moved.</p>
        <Button as={Link} to="/" variant="secondary">
          <Home size={16} /> Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
