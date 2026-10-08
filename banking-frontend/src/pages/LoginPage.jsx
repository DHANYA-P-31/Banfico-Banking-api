import { Landmark, LockKeyhole } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const { login } = useAuth();

  return (
    <main className="page" style={{ maxWidth: 520, margin: "8vh auto" }}>
      <div className="card" style={{ textAlign: "center" }}>
        <Landmark size={32} aria-hidden="true" />
        <h1>Our Bank</h1>
        <p>Open banking Consent Management System.</p>
        <p>Securely access your accounts, transactions, beneficiaries, and consents.</p>
        <button className="btn btn-primary" onClick={login}>
          <LockKeyhole size={16} /> Sign in
        </button>
      </div>
    </main>
  );
}

export default LoginPage;