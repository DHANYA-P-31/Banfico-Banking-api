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

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        // Remove error for this field when user starts correcting it
        setErrors({
            ...errors,
            [name]: "",
        });

        setApiError("");
        setSuccess("");
    }

    function validateForm() {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Beneficiary name is required";
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
        } else if (!/^\d+$/.test(formData.accountNumber)) {
            newErrors.accountNumber =
                "Account number must contain only digits";
        }

        if (!formData.bankName.trim()) {
            newErrors.bankName = "Bank name is required";
        }

        if (!formData.ifscCode.trim()) {
            newErrors.ifscCode = "IFSC code is required";
        }

        if (!formData.customerId) {
            newErrors.customerId = "Customer ID is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setApiError("");
        setSuccess("");

        // Stop if validation fails
        if (!validateForm()) {
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
                        name: formData.name.trim(),
                        accountNumber: formData.accountNumber.trim(),
                        bankName: formData.bankName.trim(),
                        ifscCode: formData.ifscCode.trim(),
                        customerId: Number(formData.customerId),
                    }),
                }
            );

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Invalid beneficiary details.");
                }

                if (response.status === 404) {
                    throw new Error("Customer not found.");
                }

                if (response.status === 409) {
                    throw new Error("Beneficiary already exists.");
                }

                throw new Error(
                    `Server error (${response.status})`
                );
            }

            await response.json();

            setSuccess("Beneficiary added successfully.");

        } catch (error) {

            if (error instanceof TypeError) {
                setApiError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            } else {
                setApiError(error.message);
            }
        }
    }

    return (
        <div>
            <h2>Add Beneficiary</h2>

            {apiError && <p>{apiError}</p>}

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

                    {errors.name && (
                        <p>{errors.name}</p>
                    )}
                </div>

                <div>
                    <label>Account Number:</label>

                    <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                    />

                    {errors.accountNumber && (
                        <p>{errors.accountNumber}</p>
                    )}
                </div>

                <div>
                    <label>Bank Name:</label>

                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                    />

                    {errors.bankName && (
                        <p>{errors.bankName}</p>
                    )}
                </div>

                <div>
                    <label>IFSC Code:</label>

                    <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                    />

                    {errors.ifscCode && (
                        <p>{errors.ifscCode}</p>
                    )}
                </div>

                <div>
                    <label>Customer ID:</label>

                    <input
                        type="number"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                    />

                    {errors.customerId && (
                        <p>{errors.customerId}</p>
                    )}
                </div>

                <button type="submit">
                    Add Beneficiary
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/beneficiaries")}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default AddBeneficiary;