import React from 'react';
import 'react-chatbot-kit/build/main.css';
import Apps from './Apps.jsx';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const MyChatbot = () => {
    return (
        <React.StrictMode>
            <section className="assistant-shell fade-in-up">
                <header className="assistant-hero">
                    <p className="assistant-kicker">Virtual Counsel</p>
                    <h1>Legal Assistant</h1>
                    <p className="assistant-lead">
                        Navigate your rights with confidence. Ask concise legal questions and receive guided answers, summaries,
                        or voice assistance in your preferred language.
                    </p>
                </header>

                <div className="assistant-panel">
                    <div className="assistant-panel__body">
                        <Apps />
                    </div>
                </div>
            </section>
        </React.StrictMode>
    );
};

export default MyChatbot;