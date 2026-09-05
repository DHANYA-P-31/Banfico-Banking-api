import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL, { parseErrorMessage, authFetch } from "../services/api";
import { formatCurrency } from "../utils/format";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { ArrowLeft } from "lucide-react";
import Badge from "../components/ui/Badge";
import { useAuth } from "../auth/AuthContext";

function TransactionHistory() {
  const { hasRole } = useAuth();
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    type: "DEPOSIT",
    amount: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [id]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authFetch(
          `${API_BASE_URL}/api/accounts/${id}/transactions`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await authFetch(
          `${API_BASE_URL}/api/accounts/${id}/transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: formData.type,
              amount: Number(formData.amount),
              transactionDate: new Date().toISOString(),
            }),
          }
      );

      if (!response.ok) {
        throw new Error(
            await parseErrorMessage(response, "Failed to create transaction")
        );
      }

      setMessage("Transaction created successfully!");

      setFormData({
        type: "DEPOSIT",
        amount: "",
      });

      fetchTransactions();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
      <div className="page">
        <PageHeader
            title="Transaction History"
            description={`Account ID ${id}`}
            action={
              <Button as={Link} to={`/accounts/${id}`} variant="secondary" size="sm">
                <ArrowLeft size={14} /> Back to Account
              </Button>
            }
        />

        {hasRole("MAKER") && (
            <Card title="Create Transaction" style={{ maxWidth: 480, marginBottom: "var(--space-5)" }}>
              <Banner variant="error">{error}</Banner>
              <Banner variant="success">{message}</Banner>

              <form onSubmit={handleSubmit}>
                <FormField label="Type" htmlFor="type">
                  <select
                      id="type"
                      className="input"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                  >
                    {/* Option values strictly match backend Enum [DEPOSIT, WITHDRAWAL] */}
                    <option value="DEPOSIT">Deposit (Credit)</option>
                    <option value="WITHDRAWAL">Withdrawal (Debit)</option>
                  </select>
                </FormField>

                <FormField label="Amount" htmlFor="amount">
                  <Input
                      id="amount"
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      min="1"
                      required
                  />
                </FormField>

                <Button type="submit">Create Transaction</Button>
              </form>
            </Card>
        )}

        <h2>Transactions</h2>

        {loading ? (
            <LoadingState label="Loading transactions..." />
        ) : transactions.length === 0 ? (
            <EmptyState title="No transactions yet" />
        ) : (
            <div className="table-wrap">
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="num">{transaction.id}</td>
                      <td>
                        <Badge
                            variant={
                              transaction.type === "DEPOSIT" ? "success" : "danger"
                            }
                        >
                          {transaction.type}
                        </Badge>
                      </td>
                      <td
                          className={
                            transaction.type === "DEPOSIT"
                                ? "amount-credit"
                                : "amount-debit"
                          }
                      >
                        {transaction.type === "DEPOSIT" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="text-muted">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
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

export default TransactionHistory;