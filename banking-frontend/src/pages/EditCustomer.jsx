import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL, { authFetch, parseErrorMessage } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import { useAuth } from "../auth/AuthContext";

function EditCustomer() {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    customerNumber: "",
    status: "ACTIVE"
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasRole("ADMIN")) {
      setError("Forbidden: Only ADMIN users can edit customer profiles.");
      setLoading(false);
      return;
    }

    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authFetch(`${API_BASE_URL}/api/customers/${id}`);
      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Failed to load customer profile."));
      }
      const data = await response.json();
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        customerNumber: data.customerNumber || `CUST${String(data.id).padStart(6, '0')}`,
        status: data.status || "ACTIVE"
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await authFetch(`${API_BASE_URL}/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
          status: formData.status
        }),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Unable to update customer."));
      }

      setMessage("Customer profile updated successfully.");
      setTimeout(() => navigate("/customers"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page"><LoadingState label="Loading customer details..." /></div>;
  }

  if (!hasRole("ADMIN")) {
    return (
        <div className="page">
          <Banner variant="error">Forbidden: Only ADMIN users can edit customer profiles.</Banner>
        </div>
    );
  }

  return (
      <div className="page">
        <PageHeader
            title={`Edit Customer (${formData.customerNumber})`}
            description="Update customer profile details."
        />

        <Card style={{ maxWidth: 520 }}>
          <Banner variant="error">{error}</Banner>
          <Banner variant="success">{message}</Banner>

          <form onSubmit={handleSubmit}>
            <FormField label="Customer Number" htmlFor="customerNumber">
              <Input
                  id="customerNumber"
                  type="text"
                  value={formData.customerNumber}
                  disabled
                  readOnly
                  style={{ backgroundColor: "#f8fafc" }}
              />
            </FormField>

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

            <FormField label="Phone Number" htmlFor="phoneNumber" error={errors.phoneNumber}>
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
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
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

export default EditCustomer;
