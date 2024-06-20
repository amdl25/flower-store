import React from 'react';
import './DespreNoi.css';
import flowerImage1 from '../../components/images/aboutUs-image1.jpg';
import flowerImage2 from '../../components/images/aboutUs-image2.jpg';

const DespreNoi = () => {
    const backgroundImageStyle = {
        backgroundImage: `url(${flowerImage1})`
    };

    return (
        <div className="about-us-wrapper">
            <div className="about-us-hero" style={backgroundImageStyle}>
                <h1>Despre Noi</h1>
            </div>
            <div className="about-us">
                <div className="about-us-content">
                    <h2>Povestea noastră</h2>
                    <p>Bine ați venit la magazinul nostru de flori! Suntem o echipă pasionată de frumusețea naturii și de arta florilor.</p>
                    <p>La magazinul nostru, ne străduim să oferim cele mai proaspete și mai frumoase flori pentru ocaziile speciale din viața dumneavoastră. Echipa noastră este formată din florari și designeri talentați, care creează buchete și aranjamente florale unice și memorabile pentru clienții noștri.
                    Ne mândrim cu serviciul nostru de înaltă calitate, cu atenția la detalii și cu pasiunea noastră pentru a aduce bucurie și frumusețe în viețile oamenilor prin intermediul florilor.</p>
                    <p>Vă mulțumim că ați ales magazinul nostru de flori și vă invităm să explorați colecția noastră și să ne contactați pentru orice nevoie.</p>
                </div>
                <div className="about-us-image">
                    <img src={flowerImage2} alt="Flower" />
                </div>
            </div>
        </div>
    );
}

export default DespreNoi;
