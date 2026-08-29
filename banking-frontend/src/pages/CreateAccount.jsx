import { useState } from "react";
import API_BASE_URL from "../services/api";

function CreateAccount() {
    const [formData, setFormData] = useState({
        accountNumber: "",
        accountType: "",
        balance: "",
        customerId: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });

        setMessage("");
        setError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber =
                "Account number is required";
        }

        if (!formData.accountType.trim()) {
            newErrors.accountType =
                "Account type is required";
        }

        if (formData.balance === "") {
            newErrors.balance =
                "Balance is required";
        } else if (Number(formData.balance) < 0) {
            newErrors.balance =
                "Balance cannot be negative";
        }

        if (!formData.customerId) {
            newErrors.customerId =
                "Customer ID is required";
        } else if (Number(formData.customerId) <= 0) {
            newErrors.customerId =
                "Customer ID must be greater than 0";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/accounts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        accountNumber:
                            formData.accountNumber.trim(),

                        accountType:
                            formData.accountType.trim(),

                        balance:
                            Number(formData.balance),

                        customerId:
                            Number(formData.customerId)
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(
                        "Invalid account details."
                    );
                }

                if (response.status === 404) {
                    throw new Error(
                        "Customer not found."
                    );
                }

                if (response.status === 409) {
                    throw new Error(
                        "Account already exists."
                    );
                }

                throw new Error(
                    `Server error (${response.status})`
                );
            }

            await response.json();

            setMessage(
                "Account created successfully!"
            );

            setFormData({
                accountNumber: "",
                accountType: "",
                balance: "",
                customerId: ""
            });

        } catch (error) {

            if (error instanceof TypeError) {
                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            } else {
                setError(error.message);
            }
        }
    };

    return (
        <div>
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>
                        Account Number:
                    </label>

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
                    <label>
                        Account Type:
                    </label>

                    <input
                        type="text"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                    />

                    {errors.accountType && (
                        <p>{errors.accountType}</p>
                    )}
                </div>

                <div>
                    <label>
                        Balance:
                    </label>

                    <input
                        type="number"
                        name="balance"
                        value={formData.balance}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                    />

                    {errors.balance && (
                        <p>{errors.balance}</p>
                    )}
                </div>

                <div>
                    <label>
                        Customer ID:
                    </label>

                    <input
                        type="number"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        min="1"
                    />

                    {errors.customerId && (
                        <p>{errors.customerId}</p>
                    )}
                </div>

                <button type="submit">
                    Create Account
                </button>

            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default CreateAccount;