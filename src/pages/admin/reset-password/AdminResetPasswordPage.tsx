import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../../api/adminAuthApi'
import logo from '../../../assets/brand/logo.svg'
import '../../../components/admin/admin.scss'

export function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const initialToken = searchParams.get('token') || ''

  const [token, setToken] = useState(initialToken)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Strong password regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const isStrongPassword = (pass: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    
    if (!token.trim()) {
      setError('Please enter the reset token/PIN provided in your email.')
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
      setSuccess(true)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data ??
        'Failed to reset password. The token may be invalid or expired.'
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
          <h1 className="admin-login__formTitle">Set New Password</h1>
          <p className="admin-login__formSub">Enter your security PIN and new secure password</p>

          {error && <div className="admin-login__error">{error}</div>}
          {success && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px', color: '#059669', marginBottom: '20px', fontSize: '14px' }}>
              Your password has been successfully reset! You can now sign in.
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="admin-login__field">
                <label htmlFor="admin-token">Security PIN / Token</label>
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

              <button
                type="submit"
                className="admin-login__submitBtn"
                disabled={loading}
              >
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
