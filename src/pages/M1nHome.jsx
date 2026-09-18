import { Link } from 'react-router-dom'
import Zx9Layout from '../components/Zx9Layout.jsx'
import DB from '../storage.js'

export default function M1nHome() {
  const rooms = DB.getRooms()

  return (
    <Zx9Layout>
      <div className="hero" style={{ padding: '96px 0 80px' }}>
        <div className="hero__inner">
          <h1 className="hero__title">Пространство для ваших конференций</h1>
          <p className="hero__subtitle">
            Современные залы, коворкинги и кинозалы в центре Москвы.
            Проведите мероприятие, которое запомнится.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn btn--primary">Зарегистрироваться</Link>
            <Link to="/rooms" className="btn btn--ghost">Смотреть залы</Link>
          </div>
        </div>
      </div>

      <h2 className="section__title">Наши залы</h2>
      <p className="section__subtitle">Три типа помещений под любые задачи</p>
      <div className="rooms-grid">
        {rooms.map(room => (
          <div className="card room-card" key={room.id}>
            <div className="image" style={{ backgroundImage: `url('${room.image}')` }}>
              <span className="room-card__type">{room.type}</span>
            </div>
            <div className="content">
              <Link to="/rooms"><span className="title">{room.name}</span></Link>
              <p className="desc">{room.description}</p>
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