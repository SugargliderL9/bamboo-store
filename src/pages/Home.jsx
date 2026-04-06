import React, { useEffect, useState } from 'react'
import IMG1 from '../assets/Bell.jpg';
import IMG2 from '../assets/Cloths.jpg';
import IMG3 from '../assets/toys.jpg';
import IMG4 from '../assets/parfume.jpg'; 
import LOGO from '../assets/Bamboologo.png'; // tu logo en PNG

const Home = () => {
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setOffsetY(window.pageYOffset);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='styled-home'>
            <section className='parallax-container'>
                <div className='parallax' style={{ transform: `translateY(${offsetY * 0.125}px)` }}>
                    
                    {/* Aquí va tu logo con fondo blanco */}
                    <div 
                      className='logo-box' 
                      style={{ transform: `translateY(${offsetY * 0.175}px)` }}
                    >
                        <img src={LOGO} alt="Bamboo Logo" />
                    </div>

                    <h1 style={{ transform: `translateY(${offsetY * 0.175}px)` }}>Bamboo</h1>
                    
                    <div className='footer-hero'></div>
                    <div className='gradient' />
                </div>
            </section>

            <section className='activities'>
                <div className='grid'>
                    <div className='item'>
                        <img src={IMG1} alt="activity" />
                        <h3> Maquillaje </h3>
                    </div>
                    <div className='item'>
                        <img src={IMG2} alt="activity" />
                        <h3> Ropa </h3>
                    </div>
                    <div className='item'>
                        <img src={IMG3} alt="activity" />
                        <h3> Juguetes </h3>
                    </div>
                    <div className='item'>
                        <img src={IMG4} alt="activity" />
                        <h3> Perfumes </h3>
                    </div>
                </div>
            </section>

            <section className='contact'>
                <p>
                    <span>Bamboo ©</span>
                </p>
            </section>
        </div>
    )
}

export default Home
