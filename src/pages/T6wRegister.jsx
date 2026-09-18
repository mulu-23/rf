import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DB from '../storage.js'

export default function T6wRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    login: '', full_name: '', phone: '', email: '', password: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (DB.getCurrentUser()) navigate('/cabinet')
  }, [navigate])

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const { login, full_name, phone, email, password } = form

    if (!login || !full_name || !phone || !email || !password) {
      setError('Заполните все поля')
      return
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(login)) {
      setError('Логин: 3–20 символов, латиница, цифры, _')
      return
    }
    if (DB.findUserByLogin(login)) {
      setError('Такой логин уже занят')
      return
    }
    if (full_name.length < 3) {
      setError('Введите корректное ФИО')
      return
    }
    if (!/^[\d\s()+\-]{10,20}$/.test(phone)) {
      setError('Некорректный номер телефона')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Некорректный email')
      return
    }
    if (password.length < 6) {
      setError('Пароль: минимум 6 символов')
      return
    }

    const user = DB.addUser({ login, password, full_name, phone, email })
    DB.setCurrentUser(user)
    navigate('/cabinet')
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <Link to="/" className="logo">Конференции<span>.РФ</span></Link>
        <h1 className="auth__title">Регистрация</h1>
        <p className="auth__subtitle">Создайте аккаунт для подачи заявок</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__group">
            <label htmlFor="login">Логин *</label>
            <input id="login" type="text" placeholder="Латиница, 3–20 символов" value={form.login} onChange={update('login')} required />
          </div>
          <div className="form__group">
            <label htmlFor="full_name">ФИО *</label>
            <input id="full_name" type="text" placeholder="Иванов Иван Иванович" value={form.full_name} onChange={update('full_name')} required />
          </div>
          <div className="form__group">
            <label htmlFor="phone">Телефон *</label>
            <input id="phone" type="tel" placeholder="+7 (999) 123-45-67" value={form.phone} onChange={update('phone')} required />
          </div>
          <div className="form__group">
            <label htmlFor="email">Email *</label>
            <input id="email" type="email" placeholder="mail@example.com" value={form.email} onChange={update('email')} required />
          </div>
          <div className="form__group">
            <label htmlFor="password">Пароль *</label>
            <input id="password" type="password" placeholder="Минимум 6 символов" value={form.password} onChange={update('password')} required />
          </div>
          <div className={`form__error ${error ? 'show' : ''}`}>{error}</div>
          <button type="submit" className="btn btn--primary btn--full">Зарегистрироваться</button>
        </form>

        <p className="auth__switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}