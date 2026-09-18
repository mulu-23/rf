import { Routes, Route } from 'react-router-dom'
import M1nHome from './pages/M1nHome.jsx'
import K4tRooms from './pages/K4tRooms.jsx'
import V7pApplication from './pages/V7pApplication.jsx'
import B2nCabinet from './pages/B2nCabinet.jsx'
import L9kAdmin from './pages/L9kAdmin.jsx'
import R3fLogin from './pages/R3fLogin.jsx'
import T6wRegister from './pages/T6wRegister.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<M1nHome />} />
      <Route path="/rooms" element={<K4tRooms />} />
      <Route path="/application" element={<V7pApplication />} />
      <Route path="/cabinet" element={<B2nCabinet />} />
      <Route path="/admin" element={<L9kAdmin />} />
      <Route path="/login" element={<R3fLogin />} />
      <Route path="/register" element={<T6wRegister />} />
    </Routes>
  )
}