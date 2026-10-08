import { useEffect, useState } from "react";
import API_BASE_URL, { authFetch, parseErrorMessage } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { Trash2 } from "lucide-react";

function CustomerBeneficiaries() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    accountNumber: "",
    bankName: "",
    ifscCode: ""
  });

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/api/me/beneficiaries`);
      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Unable to load beneficiaries."));
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.accountNumber.trim() || !form.bankName.trim() || !form.ifscCode.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await authFetch(`${API_BASE_URL}/api/me/beneficiaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          accountNumber: form.accountNumber.trim(),
          bankName: form.bankName.trim(),
          ifscCode: form.ifscCode.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Unable to add beneficiary."));
      }

      setForm({ name: "", accountNumber: "", bankName: "", ifscCode: "" });
      setSuccess("Beneficiary added successfully.");
      await loadBeneficiaries();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    setError("");
    setSuccess("");
    try {
      const response = await authFetch(`${API_BASE_URL}/api/me/beneficiaries/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Unable to delete beneficiary."));
      }

      setSuccess("Beneficiary deleted successfully.");
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="page">
        <PageHeader
            title="My Beneficiaries"
            description="Manage your registered transfer beneficiaries."
        />

        <Banner variant="error">{error}</Banner>
        <Banner variant="success">{success}</Banner>

        <Card style={{ maxWidth: 520, marginBottom: "2rem" }}>
          <h3>Add New Beneficiary</h3>
          <form onSubmit={submit}>
            <FormField label="Beneficiary Name" htmlFor="name">
              <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alice Smith"
                  required
              />
            </FormField>

            <FormField label="Account Number" htmlFor="accountNumber">
              <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="e.g. 1000000001"
                  required
              />
            </FormField>

            <FormField label="Bank Name" htmlFor="bankName">
              <Input
                  id="bankName"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="e.g. Our Bank"
                  required
              />
            </FormField>

            <FormField label="IFSC Code" htmlFor="ifscCode">
              <Input
                  id="ifscCode"
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g. BANK0001234"
                  required
              />
            </FormField>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Beneficiary"}
            </Button>
          </form>
        </Card>

        {items === null ? (
            <LoadingState label="Loading beneficiaries..." />
        ) : items.length === 0 ? (
            <EmptyState
                title="No beneficiaries found"
                description="Add your first beneficiary above to start making transfers."
            />
        ) : (
            <div className="table-wrap">
              <table>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Bank Name</th>
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.bankName}</td>
                      <td className="num">{item.accountNumber}</td>
                      <td><code>{item.ifscCode}</code></td>
                      <td>
                        <Button
                            variant="secondary"
                            className="btn-sm"
                            onClick={() => remove(item.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </Button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}

export default CustomerBeneficiaries;
