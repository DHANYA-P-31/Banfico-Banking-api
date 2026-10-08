import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL, { authFetch, parseErrorMessage } from "../services/api";
import { formatCurrency } from "../utils/format";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { ArrowLeft } from "lucide-react";

function CustomerTransactions() {
  const { id } = useParams();
  const [transactions, setTransactions] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactionsAndAccount();
  }, [id]);

  const loadTransactionsAndAccount = async () => {
    try {
      setError("");

      const [txRes, accRes] = await Promise.all([
        authFetch(`${API_BASE_URL}/api/me/accounts/${id}/transactions`),
        authFetch(`${API_BASE_URL}/api/me/accounts/${id}`)
      ]);

      if (accRes.ok) {
        setAccount(await accRes.json());
      }

      if (!txRes.ok) {
        throw new Error(await parseErrorMessage(txRes, "Transactions are not available for this account."));
      }

      const data = await txRes.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="page">
        <PageHeader
            title="Transaction History"
            description={`Account Number: ${account?.accountNumber || (transactions && transactions[0]?.accountNumber) || id}`}
            action={
              <Button as={Link} to="/customer/accounts" variant="secondary" size="sm">
                <ArrowLeft size={14} /> Back to My Accounts
              </Button>
            }
        />

        <Banner variant="error">{error}</Banner>

        {transactions === null && !error ? (
            <LoadingState label="Loading transaction history..." />
        ) : !transactions || transactions.length === 0 ? (
            <EmptyState title="No transactions yet" description="This account has no recorded transactions." />
        ) : (
            <div className="table-wrap">
              <table>
                <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>
                        <Badge variant={transaction.type === "DEPOSIT" ? "success" : "danger"}>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className={transaction.type === "DEPOSIT" ? "amount-credit" : "amount-debit"}>
                        {transaction.type === "DEPOSIT" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="text-muted">
                        {new Date(transaction.transactionDate).toLocaleString()}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}

export default CustomerTransactions;
