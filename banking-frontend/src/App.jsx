import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import CustomerList from "./pages/CustomerList";
import CreateCustomer from "./pages/CreateCustomer";

import AccountList from "./pages/AccountList";
import AccountDetails from "./pages/AccountDetails";
import CreateAccount from "./pages/CreateAccount";

import BeneficiaryList from "./pages/BeneficiaryList";
import AddBeneficiary from "./pages/AddBeneficiary";

import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>

            <h1>My Banking App</h1>

            <Navbar />

            <Routes>

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
                    path="/accounts/create"
                    element={<CreateAccount />}
                />

                <Route
                    path="/accounts/:id"
                    element={<AccountDetails />}
                />

                <Route
                    path="/beneficiaries"
                    element={<BeneficiaryList />}
                />

                <Route
                    path="/beneficiaries/add"
                    element={<AddBeneficiary />}
                />

                <Route
                    path="/"
                    element={<Home />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;