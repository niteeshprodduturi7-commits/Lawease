import React from 'react'
import './Homepage.css'

const Homepage = () => {
    return (
        <section className="home-hero" style={{ marginTop: '1.25rem' }}>
            <div className="home-left">
                <h1>Welcome back to LAWEASE</h1>
                <p className="lead">Manage your cases, documents and appointments in one secure, secure place — all in one intuitive dashboard.</p>

                {/* CTAs removed as requested */}
            </div>

            <div className="home-right">
                <div className="hero-statement">We're here to help you with your legal needs.</div>
            </div>
        </section>
    )
}

export default Homepage