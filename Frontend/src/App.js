import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import Nav from './components/Nav';
import Law from './components/Law';
import About from './components/About';
import Service from './components/Service';
import MyChatbot from './components/chatbot/Chat1.js';
import Constitution from './components/TypesofLaws/Constitution';
import Civil from './components/TypesofLaws/Civil';
import Corporate from './components/TypesofLaws/Corporate';
import Criminal from './components/TypesofLaws/Criminal';
import Cyber from './components/TypesofLaws/Cyber';
import Environmental from './components/TypesofLaws/Environmental';
import Family from './components/TypesofLaws/Family';
import Intellectual from './components/TypesofLaws/Intellectual';
import Labor from './components/TypesofLaws/Labor';
import Property from './components/TypesofLaws/Property';
import Tax from './components/TypesofLaws/Tax';
import LawTypes from './components/KeyFeatures/LawTypes.js';
import FAQ from './components/FAQs/FAQ';
import Login from './components/Login.jsx';
import Signup from './components/signup.jsx';
import KnowYourRights from './components/KeyFeatures/KnowYourRights.js';
import LegalAdvice from './components/KeyFeatures/LegalAdvice.js';
import Appointment from './components/KeyFeatures/Appointment.js';
import Session from './components/KeyFeatures/Session.js';
import Details from './components/KeyFeatures/Details.js';
import Contact from './components/Contact.js';
import DocAnalyzer from './components/DocAnalyzer';

function App() {
  // Use PUBLIC_URL so the app works both in development (root) and when deployed
  // to a subpath (e.g. GitHub Pages). If PUBLIC_URL is empty, BrowserRouter
  // will behave as if no basename is set.
  const basename = process.env.PUBLIC_URL || undefined;

  return (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation(); // Get current page

  return (
    <>
      {/* ✅ Render modern header on non-auth pages */}
      {location.pathname !== "/signup" && location.pathname !== "/login" && (
        <header className="app-header">
          <div className="container header-inner">
            <div className="brand">
              <Link to="/home" className="brand-logo">LAWEASE</Link>
              <span className="brand-sub">Legal Simplified</span>
            </div>

            <nav className="primary-nav" aria-label="Main navigation">
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/KeyFeatures/LawTypes" className="nav-link">Practice Areas</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </nav>

            <div className="header-ctas">
              <Link to="/docanalyzer" className="btn btn-primary">Analyze Doc</Link>
              <Link to="/login" className="btn btn-ghost">Logout</Link>
            </div>
          </div>
        </header>
      )}

      <main className="app-main">
        <div className="container">
          <Routes>
        {/* 🟢 Make `/login` the Landing Page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔄 Redirect to Home (Law) After Login */}
        <Route path="/home" element={<Law />} />

        {/* Other Routes */}
        <Route path="/Nav" element={<Nav />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/chatbot" element={<MyChatbot />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/KeyFeatures/LawTypes" element={<LawTypes />} />
        <Route path="/constitution" element={<Constitution />} />
        <Route path="/civil" element={<Civil />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/criminal" element={<Criminal />} />
        <Route path="/cyber" element={<Cyber />} />
        <Route path="/environment" element={<Environmental />} />
        <Route path="/family" element={<Family />} />
        <Route path="/intellectual" element={<Intellectual />} />
        <Route path="/labor" element={<Labor />} />
        <Route path="/tax" element={<Tax />} />
        <Route path="/Property" element={<Property />} />
        <Route path="/rights" element={<KnowYourRights />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/legaladvice" element={<LegalAdvice />} />
        <Route path="/Appoint" element={<Appointment />} />
        <Route path="/Session" element={<Session />} />
        <Route path="/details" element={<Details />} />
        <Route path="/docanalyzer" element={<DocAnalyzer />} />
          </Routes>
        </div>
      </main>

      {/* global footer (keeps layout consistent) */}
      {location.pathname !== "/signup" && location.pathname !== "/login" && (
        <footer className="app-footer">
          <div className="container footer-inner">© {new Date().getFullYear()} LAWEASE — Trusted Legal Assistant</div>
        </footer>
      )}
    </>
  );
}

export default App;
