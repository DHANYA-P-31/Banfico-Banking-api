import { useState } from "react";
import API_BASE_URL from "../services/api";

function CreateCustomer() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to create customer");
            }

            setMessage("Customer created successfully!");

            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                address: ""
            });

        } catch (error) {
            setError("Unable to create customer.");
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
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
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