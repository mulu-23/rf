import { useState } from 'react'
import { Link } from 'react-router-dom'
import Zx9Layout from '../components/Zx9Layout.jsx'
import DB from '../storage.js'

export default function K4tRooms() {
  const [filter, setFilter] = useState('all')
  const rooms = DB.getRooms().filter(r => filter === 'all' || r.type === filter)

  return (
    <Zx9Layout>
      <h1 className="section__title">Каталог залов</h1>
      <p className="section__subtitle">Выберите подходящее помещение</p>

      <div className="filters">
        {[
          { k: 'all', l: 'Все' },
          { k: 'Аудитория', l: 'Аудитория' },
          { k: 'Коворкинг', l: 'Коворкинг' },
          { k: 'Кинозал', l: 'Кинозал' }
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

      <div className="rooms-grid">
        {rooms.length === 0 && <div className="empty">Залы не найдены</div>}
        {rooms.map(room => (
          <div className="card room-card" key={room.id}>
            <div className="image" style={{ backgroundImage: `url('${room.image}')` }}>
              <span className="room-card__type">{room.type}</span>
            </div>
            <div className="content">
              <Link to="/application"><span className="title">{room.name}</span></Link>
              <p className="desc">{room.description}</p>
              <p className="desc"><b>Оборудование:</b> {room.equipment}</p>
              <div className="room-meta">
                <span>до {room.capacity} чел.</span>
                <span className="price">{room.price.toLocaleString('ru-RU')} ₽/день</span>
              </div>
              <Link className="action" to="/application">
                Забронировать <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Zx9Layout>
  )
}