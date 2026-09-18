import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Zx9Layout from '../components/Zx9Layout.jsx'
import DB from '../storage.js'

export default function V7pApplication() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [date, setDate] = useState('')
  const [payment, setPayment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const rooms = DB.getRooms()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const u = DB.getCurrentUser()
    if (!u) {
      navigate('/login')
      return
    }
    setUser(u)
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const room_id = parseInt(roomId, 10)
    if (!room_id) return setError('Выберите зал')
    if (!date) return setError('Укажите дату конференции')
    if (date < today) return setError('Дата не может быть в прошлом')
    if (!payment) return setError('Выберите способ оплаты')

    DB.addApplication({
      user_id: user.id,
      room_id,
      conference_date: date,
      payment_method: payment
    })

    setRoomId('')
    setDate('')
    setPayment('')
    setSuccess('Заявка отправлена! Перейдите в личный кабинет для отслеживания.')
    setTimeout(() => navigate('/cabinet'), 1500)
  }

  if (!user) return null

  return (
    <Zx9Layout narrow>
      <h1 className="section__title">Создание заявки</h1>
      <p className="section__subtitle">Заполните форму — администратор рассмотрит её</p>

      <form className="form form--card" onSubmit={handleSubmit} noValidate>
        <div className="form__group">
          <label htmlFor="room_id">Конференц-зал *</label>
          <select id="room_id" value={roomId} onChange={e => setRoomId(e.target.value)} required>
            <option value="">— Выберите зал —</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.type} ({r.price.toLocaleString('ru-RU')} ₽)
              </option>
            ))}
          </select>
        </div>

        <div className="form__group">
          <label htmlFor="conference_date">Дата конференции *</label>
          <input
            type="date"
            id="conference_date"
            value={date}
            min={today}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor="payment_method">Способ оплаты *</label>
          <select id="payment_method" value={payment} onChange={e => setPayment(e.target.value)} required>
            <option value="">— Выберите способ —</option>
            <option value="Очное посещение">Очное посещение</option>
            <option value="СБП">СБП</option>
          </select>
        </div>

        <div className={`form__error ${error ? 'show' : ''}`}>{error}</div>
        <div className={`form__success ${success ? 'show' : ''}`}>{success}</div>

        <button type="submit" className="btn btn--primary btn--full">Отправить заявку</button>
      </form>
    </Zx9Layout>
  )
}