import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Zx9Layout from '../components/Zx9Layout.jsx'
import Qw3Modal from '../components/Qw3Modal.jsx'
import DB from '../storage.js'
import '../styles/cabinet.css'

export default function B2nCabinet() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [apps, setApps] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [reviewAppId, setReviewAppId] = useState(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    const u = DB.getCurrentUser()
    if (!u) {
      navigate('/login')
      return
    }
    setUser(u)
    setApps(DB.getUserApplications(u.id))
  }, [navigate])

  const openReview = (appId) => {
    setReviewAppId(appId)
    setRating(5)
    setReviewText('')
    setReviewError('')
    setModalOpen(true)
  }

  const submitReview = (e) => {
    e.preventDefault()
    setReviewError('')
    if (!reviewText.trim() || reviewText.trim().length < 5) {
      setReviewError('Напишите отзыв (минимум 5 символов)')
      return
    }
    DB.addReview({
      user_id: user.id,
      application_id: reviewAppId,
      rating: parseInt(rating, 10),
      text: reviewText.trim()
    })
    setModalOpen(false)
    setApps(DB.getUserApplications(user.id))
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  if (!user) return null

  return (
    <Zx9Layout>
      <div className="cabinet__profile">
        <div className="cabinet__avatar">{user.full_name.charAt(0).toUpperCase()}</div>
        <div className="cabinet__info">
          <div className="cabinet__name">{user.full_name}</div>
          <div className="cabinet__meta">Логин: {user.login}</div>
          <div className="cabinet__meta">Телефон: {user.phone}</div>
          <div className="cabinet__meta">Email: {user.email}</div>
        </div>
        <Link to="/application" className="btn btn--primary">Создать заявку</Link>
      </div>

      <h2 className="section__title" style={{ fontSize: 24, marginBottom: 18 }}>Мои заявки</h2>
      <div className="app-list">
        {apps.length === 0 && (
          <div className="empty">
            У вас пока нет заявок.{' '}
            <Link to="/application" style={{ color: 'var(--primary)' }}>Создать первую →</Link>
          </div>
        )}
        {apps.map(app => {
          const room = DB.findRoomById(app.room_id)
          const review = DB.getReviewByApplication(app.id)
          const badgeClass =
            app.status === 'Новая' ? 'badge--new' :
            app.status === 'Мероприятие назначено' ? 'badge--scheduled' :
            'badge--done'

          return (
            <div className="app-card" key={app.id}>
              <div className="app-card__main">
                <div className="app-card__room">{room ? room.name : 'Зал удалён'}</div>
                <div className="app-card__details">
                  <span>Дата: {formatDate(app.conference_date)}</span>
                  <span>Оплата: {app.payment_method}</span>
                  <span>Тип: {room ? room.type : ''}</span>
                </div>
              </div>
              <div className="app-card__side">
                <span className={`badge ${badgeClass}`}>{app.status}</span>
                {app.status === 'Завершено' && (
                  review
                    ? <span className="review-done">Отзыв оставлен ({review.rating}/5)</span>
                    : <button className="btn btn--primary btn--sm" onClick={() => openReview(app.id)}>Оставить отзыв</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Qw3Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="modal__title">Оставить отзыв</h3>
        <form className="form" onSubmit={submitReview}>
          <div className="form__group">
            <label htmlFor="rating">Оценка</label>
            <select id="rating" value={rating} onChange={e => setRating(e.target.value)} required>
              <option value="5">5 — Отлично</option>
              <option value="4">4 — Хорошо</option>
              <option value="3">3 — Нормально</option>
              <option value="2">2 — Плохо</option>
              <option value="1">1 — Ужасно</option>
            </select>
          </div>
          <div className="form__group">
            <label htmlFor="reviewText">Текст отзыва</label>
            <textarea
              id="reviewText"
              rows="4"
              placeholder="Поделитесь впечатлениями..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              required
            />
          </div>
          <div className={`form__error ${reviewError ? 'show' : ''}`}>{reviewError}</div>
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary">Отправить</button>
          </div>
        </form>
      </Qw3Modal>
    </Zx9Layout>
  )
}