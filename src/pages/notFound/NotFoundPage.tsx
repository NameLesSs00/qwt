import { Link } from 'react-router-dom'
import logo from '../../assets/brand/logo.svg'
import './notFound.scss'

export function NotFoundPage() {
  return (
    <div className="notfound">
      <div className="notfound__inner">
        <div className="notfound__code">404</div>
        <div className="notfound__divider" />
        <div className="notfound__content">
          <h1 className="notfound__title">Page Not Found</h1>
          <p className="notfound__subtitle">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="notfound__btn">
            Go Back Home
          </Link>
        </div>
      </div>
      <Link to="/" className="notfound__logo">
        <img src={logo} alt="QWT" />
      </Link>
    </div>
  )
}
