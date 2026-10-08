import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL, { authFetch, parseErrorMessage } from "../services/api";
import { Plus, Edit2, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../auth/AuthContext";

function CustomerList() {
  const { hasRole } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await authFetch(`${API_BASE_URL}/api/customers`);

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Failed to fetch customers"));
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message || "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete customer ${name}?`)) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await authFetch(`${API_BASE_URL}/api/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Failed to delete customer. Only ADMIN users are authorized."));
      }

      setSuccess(`Customer ${name} deleted successfully.`);
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const isAdmin = hasRole("ADMIN");

  return (
      <div className="page">
        <PageHeader
            title="Customers"
            description="Onboarded customers and their profile details."
            action={
                isAdmin && (
                    <Button as={Link} to="/customers/create">
                      <Plus size={16} /> Create Customer
                    </Button>
                )
            }
        />

        <Banner variant="error">{error}</Banner>
        <Banner variant="success">{success}</Banner>

        {loading ? (
            <LoadingState label="Loading customers..." />
        ) : customers.length === 0 ? (
            <EmptyState
                title="No customers yet"
                description="Create your first customer to get started."
            />
        ) : (
            <div className="table-wrap">
              <table>
                <thead>
                <tr>
                  <th>Customer Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
                </thead>

                <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="num">
                        {isAdmin ? (
                            <Link to={`/customers/${customer.id}/edit`} style={{ fontWeight: 600, color: "var(--color-primary, #2563eb)" }}>
                              {customer.customerNumber || `CUST${String(customer.id).padStart(6, '0')}`}
                            </Link>
                        ) : (
                            <span>{customer.customerNumber || `CUST${String(customer.id).padStart(6, '0')}`}</span>
                        )}
                      </td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td className="num">{customer.phoneNumber}</td>
                      <td>{customer.address}</td>
                      {isAdmin && (
                          <td>
                            <div className="row" style={{ gap: "var(--space-2)" }}>
                              <Button
                                  as={Link}
                                  to={`/customers/${customer.id}/edit`}
                                  variant="secondary"
                                  className="btn-sm"
                              >
                                <Edit2 size={13} /> Edit
                              </Button>
                              <Button
                                  variant="danger"
                                  className="btn-sm"
                                  onClick={() => handleDelete(customer.id, customer.name)}
                              >
                                <Trash2 size={13} /> Delete
                              </Button>
                            </div>
                          </td>
                      )}
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}

export default CustomerList;