import React from 'react';
import { Link } from 'react-router-dom';
import lawImg from '../../assets/images/law.svg';

const filings = [
    { title: 'Civil Filing', desc: 'Guides and sample petitions for civil matters.' },
    { title: 'Criminal Pleadings', desc: 'Templates for FIR responses and criminal petitions.' },
    { title: 'Tax Filings', desc: 'Procedures and sample forms for tax disputes.' },
];

const LegalFiling = () => {
    return (
        <section className="container-wide">
            <h1 className="pad">Legal Filing</h1>
            <p className="lead" style={{ marginTop: 8 }}>Information and templates to help you prepare filings.
            </p>

            <div className="service-grid" style={{ marginTop: 18 }}>
                {filings.map((f, i) => (
                    <div key={i} className="service-card fade-in-up">
                        <img src={lawImg} alt={f.title} loading="lazy" />
                        <h3>{f.title}</h3>
                        <p className="lead" style={{ marginTop: 8 }}>{f.desc}</p>
                        <div style={{ marginTop: 12 }}>
                            <Link to="/DocAnalyzer" className="btn btn-primary">Start Filing</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LegalFiling;