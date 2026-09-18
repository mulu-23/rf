import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DB from '../storage.js'

export default function R3fLogin() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (DB.getCurrentUser()) navigate('/cabinet')
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!login.trim() || !password) {
      setError('Заполните все поля')
      return
    }
    const user = DB.findUserByLogin(login.trim())
    if (!user || user.password !== password) {
      setError('Неверный логин или пароль')
      return
    }
    DB.setCurrentUser(user)
    navigate(user.role === 'admin' ? '/admin' : '/cabinet')
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <Link to="/" className="logo">Конференции<span>.РФ</span></Link>
        <h1 className="auth__title">Вход в систему</h1>
        <p className="auth__subtitle">Введите логин и пароль</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__group">
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              placeholder="Введите логин"
              value={login}
              onChange={e => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="form__group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Введите пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={`form__error ${error ? 'show' : ''}`}>{error}</div>
          <button type="submit" className="btn btn--primary btn--full">Войти</button>
        </form>

        <p className="auth__switch">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}