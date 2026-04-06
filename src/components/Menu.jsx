import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const baseLinks = [
  { id: 1, name: 'Inicio', path: '/' },
  { id: 2, name: 'Ubicacion', path: '/ubicacion' },
  { id: 3, name: 'Catalogo', path: '/catalogo' },
  { id: 4, name: 'Nosotros', path: '/nosotros' },
]

const Menu = ({ isOpen, setIsOpen }) => {
  const { user, loading } = useAuth()

  const isAdmin = user?.email === 'bamboocuuwp@gmail.com'

  // 🔥 construir links dinámicamente
  const links = isAdmin
    ? [...baseLinks, { id: 5, name: 'Owner', path: '/owner/productos' }]
    : baseLinks

  if (loading) return null

  return (
    <div className={isOpen ? 'styled-menu menu-open' : 'styled-menu'}>
      
      <div className='links'>
        {links.map((link) => (
          <Link 
            key={link.id} 
            to={link.path} 
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className='social'>
        <a 
          href="https://www.instagram.com/bamboo_cuu/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a 
          href="https://www.facebook.com/profile.php?id=61559915630103&mibextid=ZbWKwL" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a 
          href="https://www.tiktok.com/@bamboo.cuu" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          TikTok
        </a>
      </div>

    </div>
  )
}

export default Menu