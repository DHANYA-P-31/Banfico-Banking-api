import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL, { authFetch } from "../services/api";
import { formatCurrency } from "../utils/format";
import LoadingState from "../components/ui/LoadingState";
import Banner from "../components/ui/Banner";

function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      authFetch(`${API_BASE_URL}/api/me`),
      authFetch(`${API_BASE_URL}/api/me/accounts`),
    ])
      .then(async ([profileResponse, accountsResponse]) => {
        if (!profileResponse.ok || !accountsResponse.ok) throw new Error("Unable to load your banking dashboard.");
        setProfile(await profileResponse.json());
        setAccounts(await accountsResponse.json());
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  if (error) return <div className="page"><Banner variant="error">{error}</Banner></div>;
  if (!profile) return <div className="page"><LoadingState label="Loading your dashboard..." /></div>;

  const total = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Welcome, {profile.name}</h1><p>Your online banking overview.</p></div>
      </div>
      <div className="card"><p className="text-muted">Total available balance</p><h2>{formatCurrency(total)}</h2></div>
      <h2>My Accounts</h2>
      <div className="stack" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
        {accounts.map((account) => (
          <div className="card" key={account.id}>
            <h3>{account.accountType}</h3>
            <p className="num">****{String(account.accountNumber).slice(-4)}</p>
            <p className="amount">{formatCurrency(account.balance)}</p>
            <Link className="btn btn-secondary btn-sm" to={`/customer/accounts/${account.id}/transactions`}>View transactions</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerDashboard;
