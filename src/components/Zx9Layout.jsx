import { Link, useLocation, useNavigate } from 'react-router-dom'
import DB from '../storage.js'

export default function Zx9Layout({ children, narrow = false }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = DB.getCurrentUser()

  const links = [
    { to: '/', label: 'Главная' },
    { to: '/rooms', label: 'Залы' },
    { to: '/application', label: 'Заявка' },
    { to: '/cabinet', label: 'Кабинет' },
    { to: '/admin', label: 'Админ' }
  ]

  const handleLogout = () => {
    DB.logout()
    navigate('/')
  }

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">Конференции<span>.РФ</span></Link>
          <nav className="nav">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav__link ${location.pathname === l.to ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header__auth">
            {user ? (
              <>
                <span className="header__user">{user.full_name}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn--ghost btn--sm">Админка</Link>
                )}
                <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm">Войти</Link>
                <Link to="/register" className="btn btn--primary btn--sm">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="section">
        <div className={`container ${narrow ? 'container--narrow' : ''}`}>
          {children}
        </div>
      </section>

      <footer className="footer">
        <div className="container"><p>© 2027 Конференции.РФ</p></div>
      </footer>
    </>
  )
}