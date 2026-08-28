import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

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

    if (loading) {
        return <p>Loading customers...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Customers</h1>

            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                    </thead>

                    <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phoneNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CustomerList;