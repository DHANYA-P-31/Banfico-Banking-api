import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../services/api";

function AccountDetails() {
    const { id } = useParams();

    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        return <p>Loading account...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <Link to="/accounts">Back to Accounts</Link>
            </div>
        );
    }

    return (
        <div>
            <h2>Account Details</h2>

            <p>
                <strong>ID:</strong> {account.id}
            </p>

            <p>
                <strong>Account Number:</strong> {account.accountNumber}
            </p>

            <p>
                <strong>Account Type:</strong> {account.accountType}
            </p>

            <p>
                <strong>Balance:</strong> ₹{account.balance}
            </p>

            <p>
                <strong>Customer ID:</strong> {account.customerId}
            </p>

            <Link to="/accounts">Back to Accounts</Link>
        </div>
    );
}

export default AccountDetails;