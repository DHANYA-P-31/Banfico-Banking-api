import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CustomerList from "./pages/CustomerList";
import CreateCustomer from "./pages/CreateCustomer";
import AccountList from "./pages/AccountList";
import AccountDetails from "./pages/AccountDetails";
import TransactionHistory from "./pages/TransactionHistory";
import BeneficiaryList from "./pages/BeneficiaryList";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/accounts" replace />}
                />

                <Route
                    path="/customers"
                    element={<CustomerList />}
                />

                <Route
                    path="/customers/create"
                    element={<CreateCustomer />}
                />

                <Route
                    path="/accounts"
                    element={<AccountList />}
                />

                <Route
                    path="/accounts/:id"
                    element={<AccountDetails />}
                />
                <Route
                    path="/accounts/:id/transactions"
                    element={<TransactionHistory />}
                />
                <Route
                    path="/beneficiaries"
                    element={<BeneficiaryList />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;