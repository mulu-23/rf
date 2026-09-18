import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Zx9Layout from '../components/Zx9Layout.jsx'
import DB from '../storage.js'
import '../styles/admin.css'

export default function L9kAdmin() {
  const [user, setUser] = useState(null)
  const [filter, setFilter] = useState('all')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const u = DB.getCurrentUser()
    if (u && u.role === 'admin') setUser(u)
  }, [])

  if (!user) {
    return (
      <Zx9Layout>
        <div className="empty">
          <h2>Доступ запрещён</h2>
          <p style={{ margin: '12px 0 20px' }}>Требуется вход под администратором.</p>
          <Link to="/login" className="btn btn--primary">Войти как админ</Link>
        </div>
      </Zx9Layout>
    )
  }

  const apps = DB.getApplications()
  const users = DB.getUsers()
  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  const stats = {
    total: apps.length,
    new: apps.filter(a => a.status === 'Новая').length,
    scheduled: apps.filter(a => a.status === 'Мероприятие назначено').length,
    done: apps.filter(a => a.status === 'Завершено').length
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const handleStatusChange = (id, status) => {
    DB.updateApplicationStatus(id, status)
    setTick(t => t + 1)
  }

  return (
    <Zx9Layout>
      <div className="admin__header">
        <div>
          <h1 className="section__title" style={{ fontSize: 28 }}>Админ-панель</h1>
          <p className="section__subtitle" style={{ margin: 0 }}>Управление заявками и пользователями</p>
        </div>
      </div>

      <div className="admin__stats">
        <div className="stat"><div className="stat__num">{stats.total}</div><div className="stat__label">Всего заявок</div></div>
        <div className="stat"><div className="stat__num">{stats.new}</div><div className="stat__label">Новых</div></div>
        <div className="stat"><div className="stat__num">{stats.scheduled}</div><div className="stat__label">Назначено</div></div>
        <div className="stat"><div className="stat__num">{stats.done}</div><div className="stat__label">Завершено</div></div>
      </div>

      <div className="admin__filters">
        {[
          { k: 'all', l: 'Все' },
          { k: 'Новая', l: 'Новые' },
          { k: 'Мероприятие назначено', l: 'Назначено' },
          { k: 'Завершено', l: 'Завершено' }
        ].map(f => (
          <button
            key={f.k}
            className={`filter-btn ${filter === f.k ? 'active' : ''}`}
            onClick={() => setFilter(f.k)}
          >
            {f.l}
          </button>
        ))}
      </div>

      <div className="admin-list">
        {filtered.length === 0 && <div className="empty">Заявок с таким статусом нет</div>}
        {filtered.map(app => {
          const u = DB.findUserById(app.user_id)
          const room = DB.findRoomById(app.room_id)
          return (
            <div className="admin-card" key={app.id}>
              <div>
                <div className="admin-card__title">
                  {room ? room.name : '—'}{' '}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                    · {room ? room.type : ''}
                  </span>
                </div>
                <div className="admin-card__row"><b>Пользователь:</b> {u ? u.full_name : '—'} ({u ? u.login : '—'})</div>
                <div className="admin-card__row"><b>Контакты:</b> {u ? u.phone : '—'} · {u ? u.email : '—'}</div>
                <div className="admin-card__row">
                  <b>Дата:</b> {formatDate(app.conference_date)} &nbsp;
                  <b>Оплата:</b> {app.payment_method}
                </div>
              </div>
              <div className="admin-card__side">
                <select
                  className="admin-card__select"
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value)}
                >
                  <option value="Новая">Новая</option>
                  <option value="Мероприятие назначено">Мероприятие назначено</option>
                  <option value="Завершено">Завершено</option>
                </select>
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="section__title" style={{ fontSize: 24, marginTop: 40, marginBottom: 18 }}>
        Зарегистрированные пользователи
      </h2>
      <div className="admin-list">
        {users.length === 0 && <div className="empty">Пользователей нет</div>}
        {users.map(u => (
          <div className="admin-card" key={u.id}>
            <div>
              <div className="admin-card__title">
                {u.full_name}{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                  · {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
              </div>
              <div className="admin-card__row"><b>Логин:</b> {u.login}</div>
              <div className="admin-card__row"><b>Телефон:</b> {u.phone}</div>
              <div className="admin-card__row"><b>Email:</b> {u.email}</div>
            </div>
          </div>
        ))}
      </div>
    </Zx9Layout>
  )
}