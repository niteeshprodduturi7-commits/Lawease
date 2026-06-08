import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.post('http://localhost:5000/api/auth/signup', data);

  //     if (res.data.success) {
  //       sessionStorage.setItem("userId", res.data.userId);
  //       setIsError(false);
  //       navigate('/'); 
  //     } else {
  //       setIsError(true);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("🔹 Form Data Before Sending:", data); // ✅ Log the form data

//     try {
//         const res = await axios.post(
//             "http://localhost:5000/api/auth/signup",
//             data,
//             {
//                 headers: {
//                     "Content-Type": "application/json" // ✅ Ensure JSON format
//                 }
//             }
//         );

//         console.log("✅ Response from Backend:", res.data); // ✅ Log response

//         if (res.data.success) {
//             sessionStorage.setItem("userId", res.data.userId);
//             setIsError(false);
//             navigate('/'); 
//         } else {
//             console.error("⚠️ Signup Failed - Backend Response:", res.data);
//             setIsError(true);
//         }
//     } catch (err) {
//         console.error("❌ Signup Request Failed:", err.response?.data || err.message); // ✅ Log detailed error
//         setIsError(true);
//     }
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", data);

      if (res.data.success) {
          sessionStorage.setItem("userId", res.data.userId);
          navigate('/login');  // ✅ Redirect to Home after signup
      } else {
          setIsError(true);
      }
  } catch (err) {
      console.log(err);
  }
};



  return (
    <div className={styles.wrapper}>
      <div className={styles.authCard}>
        <aside className={styles.aside} aria-hidden="true">
          <div className={styles.brand}>
            <div className={styles.logo} aria-hidden />
            <h2 className={styles.brandTitle}>Join LAWEASE</h2>
            <p className={styles.brandTag}>Create an account and start managing your legal documents.</p>
          </div>
          <div className={styles.asideFooter}>
            <p className={styles.asideText}>Trusted · Secure · Fast</p>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>Fill the details below to get started.</p>
          </div>

          {isError ? <div className={styles.error}>Invalid input</div> : null}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" placeholder="Your full name" value={data.name} onChange={handleChange} required className={styles.input} />

            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@company.com" value={data.email} onChange={handleChange} required className={styles.input} />

            <label className={styles.label} htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create a password" value={data.password} onChange={handleChange} required className={styles.input} />

            <button type="submit" className={styles.submit}>Sign Up</button>
          </form>

          <div className={styles.divider} aria-hidden>
            <span className={styles.dividerText}>Already have an account?</span>
          </div>

          <div className={styles.altActions}>
            <Link to="/login" className={styles.linkButton}>Sign in</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Signup;