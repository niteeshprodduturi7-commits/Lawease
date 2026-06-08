const Service = () => {
    return ( 
        <>
        <section className="services-shell">
            <div className="services-hero">
                <p className="services-kicker">Legal Awareness Initiative</p>
                <h1>Our Services</h1>
                <p className="services-lead">Concise guides, practical frameworks, and tailored assistance so you can navigate legal questions with clarity and confidence.</p>
            </div>

            <div className="services-grid">
                <article className="services-card">
                    <div className="services-card__label">01</div>
                    <h3>Legal Information</h3>
                    <p>Access concise and user-friendly legal information on family, property, labor, criminal, and allied laws.</p>
                </article>

                <article className="services-card">
                    <div className="services-card__label">02</div>
                    <h3>Know-Your-Rights Framework</h3>
                    <p>Explore categorized rights, entitlements, and remedies so every citizen understands the protections available to them.</p>
                </article>

                <article className="services-card">
                    <div className="services-card__label">03</div>
                    <h3>Digital Assistant</h3>
                    <p>Leverage our multilingual assistant for guided Q&A, legal summaries, and pathways to trusted legal aid services.</p>
                </article>
            </div>
        </section>
        
        </>
    );
}


export default Service;



