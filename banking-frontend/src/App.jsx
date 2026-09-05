import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingState from "./components/ui/LoadingState";
import { useAuth } from "./auth/AuthContext";

import CustomerList from "./pages/CustomerList";
import CreateCustomer from "./pages/CreateCustomer";

import AccountList from "./pages/AccountList";
import AccountDetails from "./pages/AccountDetails";
import CreateAccount from "./pages/CreateAccount";
import TransactionHistory from "./pages/TransactionHistory";

import BeneficiaryList from "./pages/BeneficiaryList";
import AddBeneficiary from "./pages/AddBeneficiary";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const { initialized, authenticated } = useAuth();
  if (!initialized) {
    return (
        <div className="page">
          <LoadingState label="Checking your session..." />
        </div>
    );
  }

  if (!authenticated) {
    return (
        <div className="page">
          <LoadingState label="Redirecting to login..." />
        </div>
    );
  }

  return (
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar />

          <Routes>
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/create" element={<CreateCustomer />} />

            <Route path="/accounts" element={<AccountList />} />
            <Route path="/accounts/create" element={<CreateAccount />} />
            <Route path="/accounts/:id" element={<AccountDetails />} />
            <Route
                path="/accounts/:id/transactions"
                element={<TransactionHistory />}
            />

            <Route path="/beneficiaries" element={<BeneficiaryList />} />
            <Route path="/beneficiaries/add" element={<AddBeneficiary />} />

            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
  );
}

export default App;