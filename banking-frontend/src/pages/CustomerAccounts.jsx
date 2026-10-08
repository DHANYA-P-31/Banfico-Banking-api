import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL, { authFetch } from "../services/api";
import { formatCurrency } from "../utils/format";
import LoadingState from "../components/ui/LoadingState";
import Banner from "../components/ui/Banner";

function CustomerAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/me/accounts`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load your accounts.");
        setAccounts(await response.json());
      })
      .catch((loadError) => setError(loadError.message));
  }, []);
  return <div className="page"><h1>My Accounts</h1><Banner variant="error">{error}</Banner>{!accounts.length && !error ? <LoadingState label="Loading accounts..." /> : accounts.map((account) => <div className="card" key={account.id}><h2>{account.accountType}</h2><p>****{String(account.accountNumber).slice(-4)}</p><p className="amount">{formatCurrency(account.balance)}</p><Link className="btn btn-secondary btn-sm" to={`/customer/accounts/${account.id}/transactions`}>Transactions</Link></div>)}</div>;
}
export default CustomerAccounts;
