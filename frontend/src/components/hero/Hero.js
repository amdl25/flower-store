import React from 'react';
import './Hero.css';
import homePage_flower from '../images/homePage-flower.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {

    const backgroundImageStyle = {
        backgroundImage: `url(${homePage_flower})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className='hero' style={backgroundImageStyle}>
            <div className='hero-left'>
                <h2>Oferă bucurie</h2>
                <h2>celor dragi</h2>
                <div className='hero-p'>
                    <p>Fiecare floare aleasă cu atenție reprezintă un omagiu adus feminității, frumuseții și eleganței. Transformă momentele în amintiri de neuitat cu aranjamentele noastre. </p>
                </div>
                <div className='hero-afla-btn'>
                    <Link to='/produse' style={{ textDecoration: "none", color: 'white' }} >
                        <div>Alege un aranjament</div>
                    </Link>
                </div>
            </div>

            <div className='hero-right'>
                
            </div>
        </div>
    )
}

export default Hero;
