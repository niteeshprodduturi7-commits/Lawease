import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Login = () => {
  const navigate = useNavigate();
  
  // ✅ Define state for login form
  const [data, setData] = useState({ email: '', password: '' });

  // ✅ Define error states
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Handle input changes
  const handleChange = ({ target: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // Reset previous errors

    try {
      console.log("🔹 Sending Login Request:", data);
      
      const res = await axios.post("http://localhost:5001/api/auth/login", data);

      if (res.data.success) {
        console.log("✅ Login Successful:", res.data);

        // ✅ Store JWT token in sessionStorage
        sessionStorage.setItem("token", res.data.token);
        
        // ✅ Redirect user to Home Page after login
        navigate('/home'); 
      } else {
        console.log("❌ Login Failed:", res.data.message);
        setError("Invalid credentials. Please try again.");
        setIsError(true);
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed. Try again.");
      setIsError(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.authCard}>
        <aside className={styles.aside} aria-hidden="true">
          <div className={styles.brand}>
            <h2 className={styles.brandTitle}>LAWEASE</h2>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.headerRow}>
            <p className={styles.kicker}>Client Hub</p>
            <h1 className={styles.title}>Access your legal cockpit</h1>
            <p className={styles.subtitle}>Review briefs, monitor cases, and keep every document synced in one encrypted space.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
              autoComplete="email"
            />

            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />

            <div className={styles.rowBetween}>
              <label className={styles.remember}><input type="checkbox" /> Remember me</label>
              <a className={styles.forgot} href="#">Forgot?</a>
            </div>

            <button type="submit" className={styles.submit}>Sign In</button>

            {isError && <div className={styles.error}>{error}</div>}
          </form>

          <div className={styles.divider} aria-hidden>
            <span className={styles.dividerText}>Or</span>
          </div>

          <div className={styles.altActions}>
            <Link to="/signup" className={styles.linkButton}>Create an account</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
