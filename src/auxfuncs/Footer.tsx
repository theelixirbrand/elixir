import { useContext } from "react";
import { CompDataContext } from "../App.tsx";
import {Link} from "react-router";

const Footer = () => {
    const context = useContext(CompDataContext);
    const compData = context['compData'];
    return (
        <>
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <p className="col-md-4 mb-0 text-body-secondary">© 2025 {compData && compData['name']}, Inc</p>

                <Link path="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none" aria-label="Bootstrap">

                </Link>

                <ul className="nav col-md-4 justify-content-end">
                    <li className="nav-item"><Link path="/" className="nav-link px-2 text-body-secondary">Home</Link></li>
                    <li className="nav-item"><Link path="/" className="nav-link px-2 text-body-secondary">Catalouge</Link></li>
                    <li className="nav-item"><Link path="/" className="nav-link px-2 text-body-secondary">Profile</Link></li>
                    <li className="nav-item"><Link path="/" className="nav-link px-2 text-body-secondary">FAQ</Link></li>
                    <li className="nav-item"><Link path="/" className="nav-link px-2 text-body-secondary">Terms and conditions</Link></li>
                </ul>
            </footer>
        </>
    )
}

export default Footer