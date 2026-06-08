import React from 'react';
import { Link } from "react-router-dom";
import MySearch from "./MySearch";
import Footer from './Footer';
import HomepageHero from './homepage/Homepage';

const Law = () => {
    const features = [
        {
            title: "Laws",
            description: "Different types of laws and their info.",
            image: "https://res.cloudinary.com/dtnvkccyy/image/upload/v1697015952/samples/law2_f8ih3c.jpg",
            alt: "Illustrations of legal icons",
            path: "/KeyFeatures/LawTypes"
        },
        {
            title: "Legal Assistant",
            description: "Explore the solutions to simplify your legal processes and make informed decisions.",
            image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?auto=format&fit=crop&w=800&q=80",
            alt: "Professionals discussing legal documents",
            path: "/chatbot"
        },
        {
            title: "Know Your Rights",
            description: "Explore ALL Your Rights",
            image: "https://res.cloudinary.com/dtnvkccyy/image/upload/v1702546813/know_bgrbmv.png",
            alt: "Know your rights icon",
            path: "/rights"
        },
        {
            title: "Legal Advice",
            description: "Get expert advice for solving legal cases.",
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
            alt: "Online legal advice visual",
            path: "/legaladvice"
        },
        {
            title: "Document Analyzer",
            description: "Upload and analyze legal documents for summaries and insights.",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
            alt: "Legal reports and analytics being reviewed",
            path: "/docanalyzer"
        }
    ];

    return (
        <>
            {/* modern welcome hero card inserted to top of Law page */}
            <HomepageHero />

            <MySearch />

            <main className="law-section">
                <section className="law-grid">
                    {features.map(({ title, description, image, alt, path }) => (
                        <Link key={title} to={path} className="law-card-link">
                            <article className="law-card">
                                <div className="law-card__media">
                                    <img src={image} alt={alt} />
                                </div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        </Link>
                    ))}
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Law;