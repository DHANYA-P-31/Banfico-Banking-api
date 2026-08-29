import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../services/api";
import { Plus, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

function BeneficiaryList() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  async function fetchBeneficiaries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/beneficiaries`);

      if (!response.ok) {
        throw new Error("Failed to fetch beneficiaries");
      }

      const data = await response.json();
      setBeneficiaries(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this beneficiary?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/beneficiaries/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Beneficiary not found");
        }

        throw new Error(`Unable to delete beneficiary (${response.status})`);
      }

      setBeneficiaries(
        beneficiaries.filter((beneficiary) => beneficiary.id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Beneficiaries"
        description="Payment beneficiaries linked to customer accounts."
        action={
          <Button as={Link} to="/beneficiaries/add">
            <Plus size={16} /> Add Beneficiary
          </Button>
        }
      />

      <Banner variant="error">{error}</Banner>

      {loading ? (
        <LoadingState label="Loading beneficiaries..." />
      ) : beneficiaries.length === 0 ? (
        <EmptyState
          title="No beneficiaries yet"
          description="Add a beneficiary to enable transfers."
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Account Number</th>
                <th>Bank Name</th>
                <th>IFSC Code</th>
                <th>Customer ID</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id}>
                  <td className="num">{beneficiary.id}</td>
                  <td>{beneficiary.name}</td>
                  <td className="num">{beneficiary.accountNumber}</td>
                  <td>{beneficiary.bankName}</td>
                  <td className="num">{beneficiary.ifscCode}</td>
                  <td className="num">{beneficiary.customerId}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(beneficiary.id)}
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

export default BeneficiaryList;
