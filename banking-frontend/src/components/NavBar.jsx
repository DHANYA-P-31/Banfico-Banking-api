import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/customers">
                Customers
            </Link>

            {" | "}

            <Link to="/accounts">
                Accounts
            </Link>

            {" | "}

            <Link to="/beneficiaries">
                Beneficiaries
            </Link>
        </nav>
    );
}

export default Navbar;