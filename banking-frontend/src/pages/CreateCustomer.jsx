import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL, { authFetch, parseErrorMessage } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";

function CreateCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdResult, setCreatedResult] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setMessage("");
    setError("");
    setCreatedResult(null);
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
      newErrors.phoneNumber = "Phone number must contain exactly 10 digits";
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
    setCreatedResult(null);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
            await parseErrorMessage(response, "Unable to create customer.")
        );
      }

      const data = await response.json();
      setCreatedResult(data);
      setMessage("Customer created successfully");

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
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
      <div className="page">
        <PageHeader
            title="Create Customer"
            description="Add a new customer record with automatic online banking identity."
        />

        <Card style={{ maxWidth: 520 }}>
          <Banner variant="error">{error}</Banner>
          <Banner variant="success">{message}</Banner>

          {createdResult && (
              <div style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#10b981" }}>Created Account Summary</h4>
                <p style={{ margin: "0.25rem 0" }}><strong>Customer ID:</strong> {createdResult.customerNumber || `CUST${String(createdResult.id).padStart(6, '0')}`}</p>
                <p style={{ margin: "0.25rem 0" }}><strong>Status:</strong> {createdResult.status || "ACTIVE"}</p>
                <p style={{ margin: "0.25rem 0" }}><strong>Online Banking:</strong> Enabled</p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                  Initial password provisioned server-side. The customer will be required to update their password upon first login.
                </p>
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField label="Name" htmlFor="name" error={errors.name}>
              <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
              />
            </FormField>

            <FormField label="Email" htmlFor="email" error={errors.email}>
              <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
              />
            </FormField>

            <FormField
                label="Phone"
                htmlFor="phoneNumber"
                error={errors.phoneNumber}
            >
              <Input
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
              />
            </FormField>

            <FormField label="Address" htmlFor="address" error={errors.address}>
              <Input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
              />
            </FormField>

            <div className="row">
              <Button type="submit">Create Customer</Button>
              <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/customers")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
  );
}

export default CreateCustomer;