import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h2>Welcome to My Banking App</h2>

            <p>
                Manage customers, accounts and beneficiaries.
            </p>

            <div>
                <Link to="/customers">
                    Customers
                </Link>
            </div>

            <div>
                <Link to="/accounts">
                    Accounts
                </Link>
            </div>

            <div>
                <Link to="/beneficiaries">
                    Beneficiaries
                </Link>
            </div>
        </div>
    );
}

export default Home;