import React from 'react';
import newsImg from '../../assets/images/news.svg';

const news = [
    { title: 'Supreme Court Updates', summary: 'Key rulings summarized for quick reading.' },
    { title: 'New Legislation', summary: 'Overview of recent bills and what they mean.' },
    { title: 'Case Analysis', summary: 'Expert commentary on landmark cases.' },
];

const LegalNews = () => {
    return (
        <section className="container-wide">
            <h1 className="pad">Legal News</h1>
            <p className="lead" style={{ marginTop: 8 }}>Stay informed with short summaries of important legal developments.</p>

            <div className="service-grid" style={{ marginTop: 18 }}>
                {news.map((n, i) => (
                    <div key={i} className="service-card fade-in-up">
                        <img src={newsImg} alt={n.title} loading="lazy" />
                        <h3>{n.title}</h3>
                        <p className="lead" style={{ marginTop: 8 }}>{n.summary}</p>
                        <div style={{ marginTop: 12 }}>
                            <button className="btn btn-outline">Read</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LegalNews;