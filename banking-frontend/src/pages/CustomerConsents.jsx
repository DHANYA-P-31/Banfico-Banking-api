import { useEffect, useState } from "react";
import API_BASE_URL, { authFetch, parseErrorMessage } from "../services/api";
import LoadingState from "../components/ui/LoadingState";
import Banner from "../components/ui/Banner";

function CustomerConsents() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const load = () => authFetch(`${API_BASE_URL}/api/me/consents`).then(async (response) => {
    if (!response.ok) throw new Error("Unable to load consents.");
    setItems(await response.json());
  }).catch((loadError) => setError(loadError.message));
  useEffect(load, []);
  const decide = async (id, action) => {
    const response = await authFetch(`${API_BASE_URL}/api/me/consents/${id}/${action}`, { method: "PUT" });
    if (!response.ok) setError(await parseErrorMessage(response, "Consent action failed."));
    else load();
  };
  return <div className="page"><h1>Open Banking Consents</h1><Banner variant="error">{error}</Banner>{items === null && !error ? <LoadingState label="Loading consents..." /> : items?.map((item) => <div className="card" key={item.id}><h3>{item.thirdPartyName}</h3><p>{item.dataScope}</p><p>Status: {item.status}</p>{item.status === "PENDING" && <div className="row"><button className="btn btn-primary" onClick={() => decide(item.id, "approve")}>Approve</button><button className="btn btn-secondary" onClick={() => decide(item.id, "reject")}>Reject</button></div>}</div>)}</div>;
}
export default CustomerConsents;
