import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Contact = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    subject:'',
    message:'',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('feedback submited successfully!');
        // You can add further actions after successful booking, e.g., redirecting the user.
      } else {
        console.error('Error submitting feedback.');
      }
       navigate("/")
    } catch (error) {
      console.error('Error:', error);
    }
  };



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData)
  };

    return (
        <>
        <section className="contact-shell" id="contact">
          <div className="contact-grid">
            <div className="contact-panel">
              <p className="contact-kicker">We're here to help</p>
              <h2>Contact Us</h2>
              <p className="contact-lead">Reach out for guidance, partnerships, or feedback. We respond within one business day.</p>

              <div className="contact-list">
                <div className="contact-item">
                  <span>Phone</span>
                  <p>+91 9666605931<br/>+91 9441267062<br/>+91 8125641651</p>
                </div>
                <div className="contact-item">
                  <span>Email</span>
                  <p>nyaaysahaayak@info.com</p>
                </div>
                <div className="contact-item">
                  <span>Address</span>
                  <p>MVSR, Hyderabad</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form>
                <input name="email" type="email" onChange={handleChange} className="input" placeholder="Email" />
                <input name="subject" type="text" onChange={handleChange} className="input" placeholder="Subject" />
                <textarea name="message" onChange={handleChange} className="input" rows={5} placeholder="Message" />
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Send Now</button>
              </form>
            </div>
          </div>
        </section>
        </>
    );
}
export default Contact;