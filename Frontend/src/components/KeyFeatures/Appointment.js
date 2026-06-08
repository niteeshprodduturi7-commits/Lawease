import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Appointment.css';
import lawyerImg from '../../assets/images/lawyer.svg';

const LoginPopup = ({ onClose }) => {
  return (
    <div className="login-popup card">
      <p>Login first to schedule a consultation</p>
      <button className="btn btn-outline" onClick={onClose}>Close</button>
    </div>
  );
};

const Appointment = () => {
  const [showPopup, setShowPopup] = useState(false);

  const HandleLogin = () => {
    if (!sessionStorage.getItem("userId")) {
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const lawyers = [
    { name: 'Abhishek Singhvi', yoe: '15+ YOE', qual: 'J.D., Harvard Law School', focus: 'Corporate Law, Mergers and Acquisitions' },
    { name: 'K. K. Venugopal', yoe: '12+ YOE', qual: 'Yale Law School', focus: 'Intellectual Property, Patent Law' },
    { name: 'Fali Sam Nariman', yoe: '10+ YOE', qual: 'Stanford Law School', focus: 'Criminal Law, Civil Litigation' },
    { name: 'Nani Palkhivala', yoe: '20+ YOE', qual: 'Oxford University', focus: 'Tax Law, Constitutional Law' },
    { name: 'Indira Jaising', yoe: '18+ YOE', qual: 'Cambridge University', focus: 'Human Rights, Family Law' },
    { name: 'Harish Salve', yoe: '25+ YOE', qual: 'London School of Economics', focus: 'International Arbitration, Commercial Law' },
  ];

  return (
    <section className="container-wide">
      <h1 className="pad">Book an Appointment Session with Legal Professionals</h1>

      <div className="service-grid" style={{ marginTop: 18 }}>
        {lawyers.map((lawyer, idx) => (
          <div key={idx} className="service-card fade-in-up">
            <Link to="/Session" onClick={HandleLogin} style={{ textDecoration: 'none' }}>
              <img src={lawyerImg} alt="Profile" loading="lazy" />
            </Link>
            <div className="law-detail" style={{ textAlign: 'center' }}>
              <h3 style={{ marginTop: 8 }}>{lawyer.name}</h3>
              <p className="muted">{lawyer.yoe} • {lawyer.qual}</p>
              <p className="lead" style={{ marginTop: 6 }}>{lawyer.focus}</p>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Link to="/Session" onClick={HandleLogin} className="btn btn-primary">Register now</Link>
            </div>
          </div>
        ))}
      </div>

      {showPopup && <LoginPopup onClose={closePopup} />}
    </section>
  );
}

export default Appointment;