import { Link } from "react-router-dom";

const MyNav = () => {
    return (
        <header className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="brand-title">LAWEASE</div>
                <nav aria-label="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link className="nav-link" to="/home">Home</Link>
                    <Link className="nav-link" to="/about">About</Link>
                    <Link className="nav-link" to="/services">Services</Link>
                    <Link className="nav-link" to="/FAQ">FAQ</Link>
                    <Link className="nav-link" to="/chatbot">Legal Assistant</Link>
                    <Link className="nav-link" to="/docanalyzer">Document Analyzer</Link>
                </nav>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link to="/contact" className="nav-link">Contact</Link>
                <button id="Log" className="btn btn-outline">
                    <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Logout</Link>
                </button>
            </div>
        </header>
    );
};

export default MyNav;