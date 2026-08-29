import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import { Link } from "react-router-dom";

function AccountList() {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/accounts`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch accounts");
                }

                return response.json();
            })
            .then((data) => {
                setAccounts(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    return (
        <div>
            <h2>Account List</h2>
            <Link to="/accounts/create">
                Create Account
            </Link>
            {error && <p>{error}</p>}

            {accounts.length === 0 && !error ? (
                <p>No accounts found.</p>
            ) : (
                <table border="1">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Account Number</th>
                        <th>Account Type</th>
                        <th>Balance</th>
                        <th>Customer ID</th>
                    </tr>
                    </thead>

                    <tbody>
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>{account.accountNumber}</td>
                            <td>{account.accountType}</td>
                            <td>₹{account.balance}</td>
                            <td>{account.customerId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AccountList;