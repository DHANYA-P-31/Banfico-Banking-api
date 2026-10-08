import { useEffect, useState } from "react";
import API_BASE_URL, { authFetch } from "../services/api";
import LoadingState from "../components/ui/LoadingState";
import Banner from "../components/ui/Banner";

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/me/profile`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load your profile.");
        setProfile(await response.json());
      })
      .catch((loadError) => setError(loadError.message));
  }, []);
  if (!profile && !error) return <div className="page"><LoadingState label="Loading profile..." /></div>;
  return <div className="page"><h1>My Profile</h1><Banner variant="error">{error}</Banner>{profile && <div className="card"><p><strong>Customer number:</strong> {profile.customerNumber || "Pending"}</p><p><strong>Name:</strong> {profile.name}</p><p><strong>Email:</strong> {profile.email}</p><p><strong>Phone:</strong> {profile.phoneNumber}</p><p><strong>Status:</strong> {profile.status || "ACTIVE"}</p></div>}</div>;
}
export default CustomerProfile;
