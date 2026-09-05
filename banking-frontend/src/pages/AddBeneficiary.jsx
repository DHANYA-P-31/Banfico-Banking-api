import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL, { parseErrorMessage, authFetch } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";

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

  const [customers, setCustomers] = useState([]);
  const [customersError, setCustomersError] = useState("");

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

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

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
      newErrors.accountNumber = "Account number must contain only digits";
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

    if (!validateForm()) {
      return;
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/api/beneficiaries`, {
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
      });

      if (!response.ok) {
        throw new Error(
            await parseErrorMessage(response, "Unable to add beneficiary.")
        );
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
      <div className="page">
        <PageHeader
            title="Add Beneficiary"
            description="Register a beneficiary for transfers."
        />

        <Card style={{ maxWidth: 480 }}>
          <Banner variant="error">{apiError}</Banner>
          <Banner variant="success">{success}</Banner>

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
                label="Bank Name"
                htmlFor="bankName"
                error={errors.bankName}
            >
              <Input
                  id="bankName"
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  error={errors.bankName}
              />
            </FormField>

            <FormField
                label="IFSC Code"
                htmlFor="ifscCode"
                error={errors.ifscCode}
            >
              <Input
                  id="ifscCode"
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  error={errors.ifscCode}
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
                      error={errors.customerId}
                  />
              )}
            </FormField>

            <div className="row">
              <Button type="submit">Add Beneficiary</Button>
              <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/beneficiaries")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
  );
}

export default AddBeneficiary;