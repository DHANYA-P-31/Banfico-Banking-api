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
import ConsentList from "./pages/ConsentList";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerAccounts from "./pages/CustomerAccounts";
import CustomerTransactions from "./pages/CustomerTransactions";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerBeneficiaries from "./pages/CustomerBeneficiaries";
import CustomerConsents from "./pages/CustomerConsents";
import EditCustomer from "./pages/EditCustomer";
import LoginPage from "./pages/LoginPage";

function CustomerRoute({ children }) {
  const { hasRole } = useAuth();
  return hasRole("CUSTOMER") ? children : <NotFound />;
}

function EmployeeRoute({ children }) {
  const { hasRole } = useAuth();
  return hasRole("ADMIN") || hasRole("MAKER") || hasRole("CHECKER") ? children : <NotFound />;
}

function AdminRoute({ children }) {
  const { hasRole } = useAuth();
  return hasRole("ADMIN") ? children : <NotFound />;
}

function LandingRoute() {
  const { hasRole } = useAuth();
  return hasRole("CUSTOMER") ? <CustomerDashboard /> : <Home />;
}

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
    return <LoginPage />;
  }

  return (
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar />

          <Routes>
            <Route path="/customer/dashboard" element={<CustomerRoute><CustomerDashboard /></CustomerRoute>} />
            <Route path="/customer/accounts" element={<CustomerRoute><CustomerAccounts /></CustomerRoute>} />
            <Route path="/customer/accounts/:id/transactions" element={<CustomerRoute><CustomerTransactions /></CustomerRoute>} />
            <Route path="/customer/profile" element={<CustomerRoute><CustomerProfile /></CustomerRoute>} />
            <Route path="/customer/beneficiaries" element={<CustomerRoute><CustomerBeneficiaries /></CustomerRoute>} />
            <Route path="/customer/consents" element={<CustomerRoute><CustomerConsents /></CustomerRoute>} />
            <Route path="/customers" element={<EmployeeRoute><CustomerList /></EmployeeRoute>} />
            <Route path="/customers/create" element={<AdminRoute><CreateCustomer /></AdminRoute>} />
            <Route path="/customers/:id/edit" element={<AdminRoute><EditCustomer /></AdminRoute>} />

            <Route path="/accounts" element={<EmployeeRoute><AccountList /></EmployeeRoute>} />
            <Route path="/accounts/create" element={<EmployeeRoute><CreateAccount /></EmployeeRoute>} />
            <Route path="/accounts/:id" element={<EmployeeRoute><AccountDetails /></EmployeeRoute>} />
            <Route
                path="/accounts/:id/transactions"
                element={<EmployeeRoute><TransactionHistory /></EmployeeRoute>}
            />

            <Route path="/beneficiaries" element={<EmployeeRoute><BeneficiaryList /></EmployeeRoute>} />
            <Route path="/beneficiaries/add" element={<EmployeeRoute><AddBeneficiary /></EmployeeRoute>} />
            <Route path="/consents" element={<EmployeeRoute><ConsentList /></EmployeeRoute>} />

            <Route path="/" element={<LandingRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
  );
}

export default App;