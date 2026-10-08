import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

function SecurityPage() {
  const { keycloak } = useAuth();
  const openAccountConsole = () => {
    if (keycloak?.accountManagement) keycloak.accountManagement();
  };
  return (
    <div className="page">
      <h1>Security</h1>
      <div className="card">
        <ShieldCheck size={24} />
        <h2>Protect your online banking</h2>
        <p>Use the secure identity service to change your password and manage multi-factor authentication.</p>
        <button className="btn btn-primary" onClick={openAccountConsole}>
          <LockKeyhole size={16} /> Manage password and MFA
        </button>
      </div>
    </div>
  );
}
export default SecurityPage;
