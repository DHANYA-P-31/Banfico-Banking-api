import { Link } from "react-router-dom";
import { Users, Wallet, Contact, ArrowRight } from "lucide-react";

const sections = [
  {
    to: "/customers",
    title: "Customers",
    desc: "View and onboard customers.",
    icon: Users,
  },
  {
    to: "/accounts",
    title: "Accounts",
    desc: "Manage bank accounts and view transaction history.",
    icon: Wallet,
  },
  {
    to: "/beneficiaries",
    title: "Beneficiaries",
    desc: "Add and manage payment beneficiaries.",
    icon: Contact,
  },
];

function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage customers, accounts, and beneficiaries.</p>
        </div>
      </div>

      <div
        className="stack"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.to} className="card">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius)",
                  background: "var(--primary-bg)",
                  color: "var(--primary-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "var(--space-3)",
                }}
              >
                <Icon size={18} strokeWidth={2} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <Link to={s.to} className="btn btn-secondary btn-sm">
                Open <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
