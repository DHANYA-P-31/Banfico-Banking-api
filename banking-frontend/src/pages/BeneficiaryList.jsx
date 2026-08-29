import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function BeneficiaryList() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/beneficiaries`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch beneficiaries");
                }

                return response.json();
            })
            .then((data) => {
                setBeneficiaries(data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading beneficiaries...</p>;
    }

    return (
        <div>
            <h2>Beneficiary List</h2>

            {error && <p>{error}</p>}

            {!error && beneficiaries.length === 0 && (
                <p>No beneficiaries found.</p>
            )}

            {!error && beneficiaries.length > 0 && (
                <table border="1">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Account Number</th>
                        <th>Bank Name</th>
                        <th>IFSC Code</th>
                        <th>Customer ID</th>
                    </tr>
                    </thead>

                    <tbody>
                    {beneficiaries.map((beneficiary) => (
                        <tr key={beneficiary.id}>
                            <td>{beneficiary.id}</td>
                            <td>{beneficiary.name}</td>
                            <td>{beneficiary.accountNumber}</td>
                            <td>{beneficiary.bankName}</td>
                            <td>{beneficiary.ifscCode}</td>
                            <td>{beneficiary.customerId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default BeneficiaryList;