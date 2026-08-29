import { useState } from "react";
import API_BASE_URL from "../services/api";

function CreateCustomer() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: ""
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

        // Remove the error for this field
        setErrors({
            ...errors,
            [name]: ""
        });

        setMessage("");
        setError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber =
                "Phone number must contain exactly 10 digits";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Validate before sending request
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/customers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        phoneNumber: formData.phoneNumber.trim(),
                        address: formData.address.trim()
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(
                        "Invalid customer details."
                    );
                }

                if (response.status === 409) {
                    throw new Error(
                        "Customer already exists."
                    );
                }

                throw new Error(
                    `Server error (${response.status})`
                );
            }

            setMessage(
                "Customer created successfully!"
            );

            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                address: ""
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
            <h1>Create Customer</h1>

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
                    <label>Email:</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {errors.email && (
                        <p>{errors.email}</p>
                    )}
                </div>

                <div>
                    <label>Phone:</label>

                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />

                    {errors.phoneNumber && (
                        <p>{errors.phoneNumber}</p>
                    )}
                </div>

                <div>
                    <label>Address:</label>

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    {errors.address && (
                        <p>{errors.address}</p>
                    )}
                </div>

                <button type="submit">
                    Create Customer
                </button>

            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default CreateCustomer;