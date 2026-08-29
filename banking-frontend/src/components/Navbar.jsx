import { NavLink } from "react-router-dom";
import { Landmark, Users, Wallet, Contact } from "lucide-react";

const links = [
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/beneficiaries", label: "Beneficiaries", icon: Contact },
];

function Navbar() {
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
      </div>
    </header>
  );
}

export default Navbar;
