import React from 'react';
import lawImg from '../../assets/images/law.svg';

const docs = [
    { title: 'Power of Attorney', desc: 'Create a standard power of attorney template for representation.' },
    { title: 'Lease Agreement', desc: 'Residential and commercial lease templates.' },
    { title: 'Employment Contract', desc: 'Standard employment agreement template with clauses.' },
    { title: 'Non-Disclosure Agreement', desc: 'NDA template for confidentiality between parties.' },
];

const LegalDocuments = () => {
    return (
        <section className="container-wide">
            <h1 className="pad">Legal Documents</h1>
            <p className="lead" style={{ marginTop: 8 }}>Browse commonly used legal templates and downloadable documents.</p>

            <div className="service-grid" style={{ marginTop: 18 }}>
                {docs.map((d, i) => (
                    <div key={i} className="service-card fade-in-up">
                        <img src={lawImg} alt={d.title} loading="lazy" />
                        <h3>{d.title}</h3>
                        <p className="lead" style={{ marginTop: 8 }}>{d.desc}</p>
                        <div style={{ marginTop: 12 }}>
                            <button className="btn btn-outline">View</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LegalDocuments;