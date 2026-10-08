import { useEffect, useState } from "react";
import API_BASE_URL, { authFetch, parseErrorMessage } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../auth/AuthContext";

function ConsentList() {
  const { hasRole } = useAuth();
  const canCreate = hasRole("ADMIN") || hasRole("MAKER");
  const canDecide = hasRole("ADMIN") || hasRole("CHECKER");
  const [consents, setConsents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    customerId: "",
    accountId: "",
    thirdPartyName: "",
    dataScope: "accounts,transactions",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [consentsRes, customersRes, accountsRes] = await Promise.all([
        authFetch(`${API_BASE_URL}/api/consents`),
        canCreate ? authFetch(`${API_BASE_URL}/api/customers`) : Promise.resolve(null),
        canCreate ? authFetch(`${API_BASE_URL}/api/accounts`) : Promise.resolve(null),
      ]);

      if (!consentsRes.ok) throw new Error(await parseErrorMessage(consentsRes, "Unable to load consents."));
      setConsents(await consentsRes.json());

      if (customersRes && customersRes.ok) {
        setCustomers(await customersRes.json());
      }
      if (accountsRes && accountsRes.ok) {
        setAccounts(await accountsRes.json());
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadConsents() {
    try {
      const response = await authFetch(`${API_BASE_URL}/api/consents`);
      if (!response.ok) throw new Error(await parseErrorMessage(response, "Unable to load consents."));
      setConsents(await response.json());
    } catch (e) {
      setError(e.message);
    }
  }

  async function createConsent(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const selectedCust = customers.find((c) => String(c.id) === String(form.customerId));
      const response = await authFetch(`${API_BASE_URL}/api/consents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(form.customerId),
          customerNumber: selectedCust?.customerNumber || "",
          accountId: Number(form.accountId),
          thirdPartyName: form.thirdPartyName,
          dataScope: form.dataScope,
          expiresAt: form.expiresAt,
        }),
      });
      if (!response.ok) throw new Error(await parseErrorMessage(response, "Unable to create consent."));
      setMessage("Consent request created successfully.");
      setForm({ customerId: "", accountId: "", thirdPartyName: "", dataScope: "accounts,transactions", expiresAt: "" });
      await loadConsents();
    } catch (e) {
      setError(e.message);
    }
  }

  async function decide(id, decision) {
    setError("");
    try {
      const response = await authFetch(`${API_BASE_URL}/api/consents/${id}/${decision}`, { method: "PUT" });
      if (!response.ok) throw new Error(await parseErrorMessage(response, `Unable to ${decision} consent.`));
      await loadConsents();
    } catch (e) {
      setError(e.message);
    }
  }

  const selectedCust = customers.find((c) => String(c.id) === String(form.customerId));

  const availableAccounts = form.customerId
    ? accounts.filter(
        (acc) =>
          String(acc.customerId) === String(form.customerId) ||
          (selectedCust?.customerNumber &&
            String(acc.customerNumber || acc.customerId) === String(selectedCust.customerNumber))
      )
    : [];

  return (
    <div className="page">
      <PageHeader title="Consents" description="Manage third-party access to customer account data." />
      <Banner variant="error">{error}</Banner>
      <Banner variant="success">{message}</Banner>
      {canCreate && (
        <form onSubmit={createConsent} className="card" style={{ marginBottom: "var(--space-6)" }}>
          <h3>Create consent request</h3>
          <div className="grid-2">
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", fontWeight: 600 }}>Select Customer</label>
              <select
                required
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value, accountId: "" })}
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name} {cust.customerNumber ? `(${cust.customerNumber})` : `(ID: ${cust.id})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", fontWeight: 600 }}>Select Account</label>
              <select
                required
                disabled={!form.customerId}
                value={form.accountId}
                onChange={(e) => setForm({ ...form, accountId: e.target.value })}
              >
                <option value="">-- {form.customerId ? "Choose Account" : "Select Customer First"} --</option>
                {availableAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} ({acc.accountType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", fontWeight: 600 }}>Third-Party Application Name</label>
              <input
                required
                placeholder="e.g. Plaid, QuickBooks, Mint"
                value={form.thirdPartyName}
                onChange={(e) => setForm({ ...form, thirdPartyName: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", fontWeight: 600 }}>Data Scope</label>
              <input
                required
                placeholder="Data scope (e.g. accounts,transactions)"
                value={form.dataScope}
                onChange={(e) => setForm({ ...form, dataScope: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", fontWeight: 600 }}>Expiration Date & Time</label>
              <input
                required
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" style={{ marginTop: "1rem" }}>Create Consent</Button>
        </form>
      )}
      {loading ? (
        <LoadingState label="Loading consents..." />
      ) : consents.length === 0 ? (
        <EmptyState title="No consent requests" description="Create a request to share account data with a third party." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Number</th>
                <th>Customer Name</th>
                <th>Account Number</th>
                <th>Third Party</th>
                <th>Scope</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consents.map((consent) => (
                <tr key={consent.id}>
                  <td>{consent.id}</td>
                  <td><strong>{consent.customerNumber || consent.customerId}</strong></td>
                  <td>{consent.customerName || "-"}</td>
                  <td><code>{consent.accountNumber || consent.accountId}</code></td>
                  <td>{consent.thirdPartyName}</td>
                  <td>{consent.dataScope}</td>
                  <td>{consent.status}</td>
                  <td>
                    {consent.status === "PENDING" && canDecide && (
                      <span className="row">
                        <Button size="sm" onClick={() => decide(consent.id, "approve")}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => decide(consent.id, "reject")}>Reject</Button>
                      </span>
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

export default ConsentList;

