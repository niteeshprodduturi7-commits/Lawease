const highlights = [
    {
        title: 'Empowering Communities',
        body: 'Our mission is to uplift citizens—especially marginalized voices—through a comprehensive Know-Your-Rights framework and multilingual guidance.',
    },
    {
        title: 'Simplifying Law',
        body: 'We turn dense legislation into clear, human language so every resident can understand protections, obligations, and next steps with confidence.',
    },
    {
        title: 'Up-to-Date Insight',
        body: 'In collaboration with legal aid partners, we continuously refresh our content to mirror every shift in the legal landscape.',
    },
];

const About = () => {
    return (
        <section className="about-shell">
            <div className="about-hero">
                <p className="about-kicker">Legal Awareness Initiative</p>
                <h1>About Us</h1>
                <p className="about-lead">
                    Welcome to our platform dedicated to providing legal information and guidance to all citizens, with an unwavering focus on accessibility and user friendliness.
                </p>
            </div>

            <div className="about-grid">
                {highlights.map((item, index) => (
                    <article key={item.title} className="about-card">
                        <span className="about-card__badge">{String(index + 1).padStart(2, '0')}</span>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default About;


