import React, { useState, useEffect } from 'react'
import { Equals, X, ShoppingCart } from 'phosphor-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useQuoteCart } from '../context/QuoteCartContext'

const MotionLink = motion(Link)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  const { user } = useAuth()
  const { items } = useQuoteCart()

  const isAdmin = user?.email === 'bamboocuuwp@gmail.com'

  const toggle = () => setIsOpen(!isOpen)

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <nav className={`styled-navbar ${hidden ? 'hidden' : ''}`}>

        {/* IZQUIERDA */}
        <div className="nav-left">
          <span onClick={toggle}>
            {!isOpen ? <Equals size={25} /> : <X size={25} />}
          </span>
        </div>

        {/* DERECHA */}
        <div className="nav-right">

          {/* 🛒 CARRITO (CLICK FUNCIONA) */}
          <Link to="/cotizacion" className="cart-icon">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={26} color="white" />

              <AnimatePresence>
                {items.length > 0 && (
                  <motion.span
                    key={items.length}
                    className="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {items.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {/* ADMIN */}
          {isAdmin && (
            <MotionLink
              to="/owner/productos"
              className="nav-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Admin
            </MotionLink>
          )}

          {/* LOGIN / LOGOUT */}
          {user ? (
            <motion.button
              className="nav-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          ) : (
            <MotionLink
              to="/login"
              className="nav-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar sesión
            </MotionLink>
          )}

        </div>
      </nav>

      <Menu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default Navbar