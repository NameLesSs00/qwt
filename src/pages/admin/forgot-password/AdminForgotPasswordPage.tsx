import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../../../api/adminAuthApi'
import logo from '../../../assets/HurghadaFunTime.png'
import '../../../components/admin/admin.scss'

export function AdminForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Email, 2: Token+Password, 3: Success

  // Step 1 state
  const [email, setEmail] = useState('')

  // Step 2 state
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Strong password regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const isStrongPassword = (pass: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)
  }

  async function handleSendEmail(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await forgotPassword(email)
      setStep(2) // Move to Token entry step
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data ??
        'Failed to process request. Please try again.'
      setError(typeof msg === 'string' ? msg : 'Error processing request.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!token.trim()) {
      setError('Please enter the security PIN provided in your email.')
      return
    }

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await resetPassword(token, password)
      setStep(3) // Move to Success step
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data ??
        'Failed to reset password. The PIN may be invalid or expired.'
      setError(typeof msg === 'string' ? msg : 'Error resetting password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      {/* Brand panel */}
      <div className="admin-login__brand">
        <img src={logo} alt="QWT" className="admin-login__brandLogo" />
        <h2 className="admin-login__brandTitle">Admin Panel</h2>
        <p className="admin-login__brandSub">
          Manage your trips, bookings, content, and more from one central hub.
        </p>
        <div className="admin-login__brandDots">
          <span /><span /><span />
        </div>
      </div>

      {/* Form panel */}
      <div className="admin-login__form">
        <div className="admin-login__formInner">
          <h1 className="admin-login__formTitle">Reset Password</h1>

          {step === 1 && <p className="admin-login__formSub">Enter your email to receive a security PIN</p>}
          {step === 2 && <p className="admin-login__formSub">Enter the PIN sent to your email and a new password</p>}
          {step === 3 && <p className="admin-login__formSub">Success!</p>}

          {error && <div className="admin-login__error">{error}</div>}

          {step === 3 && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px', color: '#059669', marginBottom: '20px', fontSize: '14px' }}>
              Your password has been successfully reset! You can now sign in with your new credentials.
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendEmail}>
              <div className="admin-login__field">
                <label htmlFor="admin-email">Email address</label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="admin-login__submitBtn" disabled={loading}>
                {loading ? 'Sending PIN…' : 'Send Reset PIN'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <div className="admin-login__field">
                <label htmlFor="admin-token">Security PIN</label>
                <input
                  id="admin-token"
                  type="text"
                  placeholder="e.g. 456789"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>

              <div className="admin-login__field">
                <label htmlFor="admin-pass">New Password</label>
                <input
                  id="admin-pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="admin-login__field">
                <label htmlFor="admin-pass-confirm">Confirm Password</label>
                <input
                  id="admin-pass-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="admin-login__submitBtn" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link to="/admin/login" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>
              &larr; Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
