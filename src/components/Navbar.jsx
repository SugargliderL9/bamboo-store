import React, { useState, useEffect } from 'react'
import { Equals, X } from 'phosphor-react'
import { motion } from 'framer-motion'
import Menu from './Menu'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)

    const { user } = useAuth()
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
                
                {/* MENU ICON */}
                <span onClick={toggle}>
                    {!isOpen ? <Equals size={25} /> : <X size={25} />}
                </span>

                {/* ADMIN LINK */}
                {isAdmin && (
                    <a href="/owner/productos"></a>
                )}

                {/* LOGIN / LOGOUT */}
                {user ? (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                    >
                        Logout
                    </motion.button>
                ) : (
                    <a href="/login">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Iniciar sesión
                        </motion.button>
                    </a>
                )}
            </nav>

            <Menu isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}

export default Navbar