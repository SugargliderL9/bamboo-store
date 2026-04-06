import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Ubicacion from './pages/Ubicacion'
import Nosotros from './pages/Nosotros'
import OwnerProductos from './pages/OwnerProductos'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import './style/Global.scss'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/owner/productos"element={<ProtectedRoute> <OwnerProductos /> </ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App
