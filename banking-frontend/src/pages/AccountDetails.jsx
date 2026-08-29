import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../services/api";
import { formatCurrency } from "../utils/format";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import { ArrowLeft, Receipt } from "lucide-react";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";

function AccountDetails() {
  const { id } = useParams();

  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE_URL}/api/accounts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Account not found");
        }

        return response.json();
      })
      .then((data) => {
        setAccount(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <LoadingState label="Loading account..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Banner variant="error">{error}</Banner>
        <Button as={Link} to="/accounts" variant="secondary">
          <ArrowLeft size={16} /> Back to Accounts
        </Button>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title="Account Details"
        description={`Account #${account.accountNumber}`}
        action={
          <Button as={Link} to="/accounts" variant="secondary" size="sm">
            <ArrowLeft size={14} /> Back to Accounts
          </Button>
        }
      />

      <Card style={{ maxWidth: 480 }}>
        <div className="stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="text-muted">ID</span>
            <span className="num">{account.id}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="text-muted">Account Number</span>
            <span className="num">{account.accountNumber}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="text-muted">Account Type</span>
            <span>{account.accountType}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="text-muted">Balance</span>
            <span className="amount">{formatCurrency(account.balance)}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="text-muted">Customer ID</span>
            <span className="num">{account.customerId}</span>
          </div>
        </div>
      </Card>

      <div className="row" style={{ marginTop: "var(--space-4)" }}>
        <Button as={Link} to={`/accounts/${account.id}/transactions`}>
          <Receipt size={16} /> View Transactions
        </Button>
      </div>
    </div>
  );
}

export default AccountDetails;
