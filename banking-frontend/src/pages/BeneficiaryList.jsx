import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL, { authFetch } from "../services/api";
import { Plus, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../auth/AuthContext";

function BeneficiaryList() {
  const { hasRole } = useAuth();
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

      const response = await authFetch(`${API_BASE_URL}/api/beneficiaries`);

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
      const response = await authFetch(
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
                hasRole("MAKER") && (
                    <Button as={Link} to="/beneficiaries/add">
                      <Plus size={16} /> Add Beneficiary
                    </Button>
                )
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
                  <th>Name</th>
                  <th>Account Number</th>
                  <th>Bank Name</th>
                  <th>IFSC Code</th>
                  <th>Customer Number</th>
                  <th></th>
                </tr>
                </thead>

                <tbody>
                {beneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.id}>
                      <td>{beneficiary.name}</td>
                      <td className="num">{beneficiary.accountNumber}</td>
                      <td>{beneficiary.bankName}</td>
                      <td className="num">{beneficiary.ifscCode}</td>
                      <td className="num">{beneficiary.customerNumber || beneficiary.customerId}</td>
                      <td>
                        {(hasRole("ADMIN") || hasRole("CHECKER")) && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(beneficiary.id)}
                            >
                              <Trash2 size={14} /> Delete
                            </Button>
                        )}
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