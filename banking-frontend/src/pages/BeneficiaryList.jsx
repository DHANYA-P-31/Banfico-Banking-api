import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";

function BeneficiaryList() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    async function fetchBeneficiaries() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/beneficiaries`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch beneficiaries");
            }

            const data = await response.json();
            setBeneficiaries(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this beneficiary?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/beneficiaries/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Beneficiary not found");
                }

                throw new Error(
                    `Unable to delete beneficiary (${response.status})`
                );
            }

            setBeneficiaries(
                beneficiaries.filter(
                    (beneficiary) => beneficiary.id !== id
                )
            );
        } catch (error) {
            setError(error.message);
        }
    }

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
                        <th>Action</th>
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

                            <td>
                                <button
                                    onClick={() =>
                                        handleDelete(beneficiary.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default BeneficiaryList;