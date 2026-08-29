import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CustomerList from "./pages/CustomerList";
import CreateCustomer from "./pages/CreateCustomer";
import AccountList from "./pages/AccountList";
import AccountDetails from "./pages/AccountDetails";

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

            </Routes>
        </BrowserRouter>
    );
}

export default App;