import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";

function TransactionHistory() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            setError(
                "Unable to load transactions. Please check the backend."
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return <p>Loading transactions...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>

                <button onClick={() => navigate(`/accounts/${id}`)}>
                    Back to Account
                </button>
            </div>
        );
    }

    return (
        <div>

            <h1>Transaction History</h1>

            <h2>Account ID: {id}</h2>

            {transactions.length === 0 ? (

                <p>No transactions found.</p>

            ) : (

                <table border="1">

                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>transactionDate</th>
                    </tr>
                    </thead>

                    <tbody>

                    {transactions.map((transaction) => (

                        <tr key={transaction.id}>

                            <td>{transaction.id}</td>

                            <td>{transaction.type}</td>

                            <td>₹{transaction.amount}</td>

                            <td>{new Date(transaction.transactionDate).toDateString()}</td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            )}

            <br />

            <button onClick={() => navigate(`/accounts/${id}`)}>
                Back to Account
            </button>

        </div>
    );
}

export default TransactionHistory;