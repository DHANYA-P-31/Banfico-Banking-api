import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL, { parseErrorMessage, authFetch } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";

function CreateAccount() {
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountType: "",
    balance: "",
    customerId: "",
  });

  const [customers, setCustomers] = useState([]);
  const [customersError, setCustomersError] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/customers`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load customers");
          }
          return response.json();
        })
        .then((data) => setCustomers(data))
        .catch(() =>
            setCustomersError(
                "Could not load customer list. You can still type a customer ID manually below."
            )
        );
  }, []);

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

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    }

    if (!formData.accountType.trim()) {
      newErrors.accountType = "Account type is required";
    }

    if (formData.balance === "") {
      newErrors.balance = "Balance is required";
    } else if (Number(formData.balance) < 0) {
      newErrors.balance = "Balance cannot be negative";
    }

    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    } else if (Number(formData.customerId) <= 0) {
      newErrors.customerId = "Customer ID must be greater than 0";
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
      const response = await authFetch(`${API_BASE_URL}/api/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: formData.accountNumber.trim(),
          accountType: formData.accountType.trim(),
          balance: Number(formData.balance),
          customerId: Number(formData.customerId),
        }),
      });

      if (!response.ok) {
        throw new Error(
            await parseErrorMessage(response, "Unable to create account.")
        );
      }

      await response.json();

      setMessage("Account created successfully!");

      setFormData({
        accountNumber: "",
        accountType: "",
        balance: "",
        customerId: "",
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
            title="Create Account"
            description="Open a new bank account for a customer."
        />

        <Card style={{ maxWidth: 480 }}>
          <Banner variant="error">{error}</Banner>
          <Banner variant="success">{message}</Banner>

          <form onSubmit={handleSubmit}>
            <FormField
                label="Account Number"
                htmlFor="accountNumber"
                error={errors.accountNumber}
            >
              <Input
                  id="accountNumber"
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  error={errors.accountNumber}
              />
            </FormField>

            <FormField
                label="Account Type"
                htmlFor="accountType"
                error={errors.accountType}
                hint="e.g. SAVINGS, CURRENT"
            >
              <Input
                  id="accountType"
                  type="text"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  error={errors.accountType}
              />
            </FormField>

            <FormField label="Balance" htmlFor="balance" error={errors.balance}>
              <Input
                  id="balance"
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  error={errors.balance}
              />
            </FormField>

            <FormField
                label="Customer"
                htmlFor="customerId"
                error={errors.customerId}
                hint={customersError || undefined}
            >
              {customers.length > 0 ? (
                  <select
                      id="customerId"
                      className={`input${errors.customerId ? " error" : ""}`}
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                  >
                    <option value="">Select a customer...</option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (ID: {c.id})
                        </option>
                    ))}
                  </select>
              ) : (
                  <Input
                      id="customerId"
                      type="number"
                      name="customerId"
                      placeholder="Enter customer ID"
                      value={formData.customerId}
                      onChange={handleChange}
                      min="1"
                      error={errors.customerId}
                  />
              )}
            </FormField>

            <div className="row">
              <Button type="submit">Create Account</Button>
              <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/accounts")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
  );
}

export default CreateAccount;