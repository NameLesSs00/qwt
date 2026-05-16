import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import axiosClient from '../../api/axiosClient';
import './loginPage.scss';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      
      const response = await axiosClient.post('/Auth/login', {
        email,
        password,
      });

      // Based on usual standard we get token back
      const token = response.data?.data; 
      if (token) {
        dispatch(setCredentials({ token, user: { email } }));
        // Successful login, redirect to home or previous page
        navigate('/');
      } else {
        setErrorMsg('Login failed: Token not received');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {errorMsg && <div className="login-error">{errorMsg}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-formGroup">
            <label className="login-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="login-formGroup">
            <label className="login-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <Link to="/sign-up" className="login-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
