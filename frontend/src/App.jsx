import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ArtworkList from './components/ArtworkList'
import ArtworkDetail from './components/ArtworkDetail'
import ArtworkForm from './components/ArtworkForm'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isLoggedIn ? <Dashboard user={user} /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/artworks" element={<ArtworkList />} />
          <Route path="/artworks/:id" element={<ArtworkDetail />} />
          <Route path="/artworks/new" element={<ArtworkForm />} />
          <Route path="/artworks/edit/:id" element={<ArtworkForm />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
