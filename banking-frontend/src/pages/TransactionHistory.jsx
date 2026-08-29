import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../services/api";

function TransactionHistory() {
    const { id } = useParams();
    const [transactions, setTransactions] = useState([]);

    // Updated initial state to match Spring Boot Enum constraints
    const [formData, setFormData] = useState({
        type: "DEPOSIT",
        amount: ""
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
            const response = await fetch(
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
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/accounts/${id}/transactions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: formData.type,
                        amount: Number(formData.amount),
                        transactionDate: new Date().toISOString()
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create transaction");
            }

            setMessage("Transaction created successfully!");

            // Form reset matches Backend Enum values
            setFormData({
                type: "DEPOSIT",
                amount: ""
            });

            fetchTransactions();
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <p>Loading transactions...</p>;
    }

    return (
        <div>
            <h2>Transaction History</h2>
            <p>
                <strong>Account ID:</strong> {id}
            </p>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <h3>Create Transaction</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Type: </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        {/* Option values strictly match backend Enum [DEPOSIT, WITHDRAWAL] */}
                        <option value="DEPOSIT">Deposit (Credit)</option>
                        <option value="WITHDRAWAL">Withdrawal (Debit)</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Amount: </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Create Transaction
                </button>
            </form>

            <hr />

            <h3>Transactions</h3>

            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
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
                            <td>{transaction.id}</td>
                            <td>{transaction.type}</td>
                            <td>₹{transaction.amount}</td>
                            <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <br />
            <Link to={`/accounts/${id}`}>
                Back to Account
            </Link>
        </div>
    );
}

export default TransactionHistory;
