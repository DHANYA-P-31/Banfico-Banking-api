import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";

function AddBeneficiary() {
    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        customerId: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name ||
            !formData.accountNumber ||
            !formData.bankName ||
            !formData.ifscCode ||
            !formData.customerId
        ) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/beneficiaries`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        accountNumber: formData.accountNumber,
                        bankName: formData.bankName,
                        ifscCode: formData.ifscCode,
                        customerId: Number(formData.customerId),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add beneficiary");
            }

            await response.json();

            setSuccess("Beneficiary added successfully.");

            setFormData({
                name: "",
                accountNumber: "",
                bankName: "",
                ifscCode: "",
                customerId: "",
            });
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h2>Add Beneficiary</h2>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Account Number:</label>
                    <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Bank Name:</label>
                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>IFSC Code:</label>
                    <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Customer ID:</label>
                    <input
                        type="number"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    Add Beneficiary
                </button>
            </form>
        </div>
    );
}

export default AddBeneficiary;