import { useState, type FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { adminLogin, adminUpdateUser } from '../../../store/slices/adminAuthSlice'
import { loginAdmin } from '../../../api/adminAuthApi'
import { getAdmins } from '../../../api/adminsApi'
import logo from '../../../assets/HurghadaFunTime.png'
import '../../../components/admin/admin.scss'

export function AdminLoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginAdmin(email, password)

      // Check role if backend returns it
      if (data.role && !data.role.toLowerCase().includes('admin')) {
        setError('Access denied. You do not have administrator privileges.')
        setLoading(false)
        return;
      }

      // Decode JWT payload safely to extract the admin ID
      let adminId = 'admin';
      try {
        let base64 = data.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        const claims = JSON.parse(atob(base64));
        adminId = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 'admin';
      } catch (e) {
        console.error('Failed to parse JWT token', e);
      }

      dispatch(adminLogin({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: adminId,
          name: 'Admin User',
          email: email,
          role: data.role || 'Admin',
        },
      }))

      // Resolve the administrator's actual first and last name from the database
      try {
        const response = await getAdmins(1, 100);
        const matchingAdmin = response.data?.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        if (matchingAdmin) {
          dispatch(adminUpdateUser({
            name: `${matchingAdmin.firstName} ${matchingAdmin.lastName}`
          }));
        }
      } catch (err) {
        console.error('Failed to resolve real admin display name', err);
      }

      navigate('/admin/reports', { replace: true })
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data ??
        'Invalid email or password. Please try again.'
      setError(typeof msg === 'string' ? msg : 'Login failed. Please try again.')
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
          <h1 className="admin-login__formTitle">Welcome back</h1>
          <p className="admin-login__formSub">Sign in to your admin account</p>

          {error && <div className="admin-login__error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="admin-login__field">
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="admin-login__field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label htmlFor="admin-password" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/admin/forgot-password" style={{ fontSize: '13px', color: '#1e659e', textDecoration: 'none', fontWeight: 500 }}>
                  Forgot Password?
                </Link>
              </div>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="admin-login__submitBtn"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
