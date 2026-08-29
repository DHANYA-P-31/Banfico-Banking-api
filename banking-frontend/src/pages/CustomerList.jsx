import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../services/api";
import { Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/customers`);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();

      setCustomers(data);
    } catch (error) {
      setError("Unable to load customers. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Customers"
        description="Onboarded customers and their contact details."
        action={
          <Button as={Link} to="/customers/create">
            <Plus size={16} /> Create Customer
          </Button>
        }
      />

      <Banner variant="error">{error}</Banner>

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
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="num">{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td className="num">{customer.phoneNumber}</td>
                  <td>{customer.address}</td>
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
