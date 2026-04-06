import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import '../style/Login.scss'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔥 REDIRIGIR SI YA ESTÁ LOGUEADO
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = '/'
      }
    })
  }, [])

  async function handleLogin(e) {
    e.preventDefault()

    // 🔥 VALIDACIÓN BÁSICA
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      // 🔥 MENSAJE MÁS SEGURO (no filtra info)
      setError('Credenciales incorrectas')
      setPassword('') // limpia password
    } else {
      // 🔥 LIMPIAR CAMPOS
      setEmail('')
      setPassword('')

      window.location.href = '/owner/productos'
    }

    setLoading(false)
  }

  return (
    <div className="login">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="username" // 🔥 mejora seguridad UX
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password" // 🔥 importante
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>

        {error && <p className="error">{error}</p>}
      </motion.div>
    </div>
  )
}