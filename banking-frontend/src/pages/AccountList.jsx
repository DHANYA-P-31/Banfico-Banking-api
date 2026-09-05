import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL, { authFetch } from "../services/api";
import { formatCurrency } from "../utils/format";
import { Plus, Eye } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../auth/AuthContext";

function AccountList() {
    const { hasRole } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);

        authFetch(`${API_BASE_URL}/api/accounts`)
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
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="page">
            <PageHeader
                title="Accounts"
                description="Bank accounts and current balances."
                action={
                    hasRole("ADMIN") && (
                        <Button as={Link} to="/accounts/create">
                            <Plus size={16} /> Create Account
                        </Button>
                    )
                }
            />

            <Banner variant="error">{error}</Banner>

            {loading ? (
                <LoadingState label="Loading accounts..." />
            ) : accounts.length === 0 ? (
                <EmptyState
                    title="No accounts yet"
                    description="Create an account to get started."
                />
            ) : (
                <div className="table-wrap">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Account Number</th>
                            <th>Type</th>
                            <th>Balance</th>
                            <th>Customer ID</th>
                            <th></th>
                        </tr>
                        </thead>

                        <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td className="num">{account.id}</td>
                                <td className="num">{account.accountNumber}</td>
                                <td>{account.accountType}</td>
                                <td className="amount">{formatCurrency(account.balance)}</td>
                                <td className="num">{account.customerId}</td>
                                <td>
                                    <Link
                                        to={`/accounts/${account.id}`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <Eye size={14} /> View
                                    </Link>
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

export default AccountList;