import { NavLink } from "react-router-dom";
import { Landmark, Users, Wallet, Contact, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const links = [
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/beneficiaries", label: "Beneficiaries", icon: Contact },
  { to: "/consents", label: "Consents", icon: ShieldCheck },
];

function Navbar() {
  const { username, logout } = useAuth();

  return (
      <header className="appbar">
        <div className="appbar-inner">
          <NavLink to="/" className="appbar-brand">
          <span className="mark">
            <Landmark size={13} strokeWidth={2.5} />
          </span>
            Our Bank
          </NavLink>

          <nav className="appbar-links">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                  <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                          isActive ? "appbar-link active" : "appbar-link"
                      }
                  >
                <span className="row" style={{ gap: "var(--space-2)" }}>
                  <Icon size={15} strokeWidth={2} />
                  {link.label}
                </span>
                  </NavLink>
              );
            })}
          </nav>

          <div className="row" style={{ gap: "var(--space-3)" }}>
            {username && (
                <span
                    className="text-faint"
                    style={{ fontSize: 13 }}
                >
              {username}
            </span>
            )}
            <button
                className="appbar-link"
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                }}
            >
              <LogOut size={15} strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      </header>
  );
}

export default Navbar;