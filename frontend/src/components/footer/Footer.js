import React from 'react';
import './Footer.css';
import footer_logo from '../images/logo.png';
import instagram_icon from '../images/instagram-icon.png';
import pinterest_icon from '../images/pinterest-icon.png';
import location_icon from '../images/location-icon.png';
import phone_icon from '../images/phone-icon.png';

const Footer = () => {
    const address = "Str Prometeu nr.20, sector 1, București";
    const phoneNumber = "0735531410";
    const email = "contact@eden.com";

    return (
        <footer className='footer'>
            <div className='footer-content'>
                <div className='footer-logo'>
                    <img src={footer_logo} alt="" />
                    <p>Eden</p>
                </div>
                <div className='footer-contact'>
                    <p className='footer-info'>Informațiile magazinului</p>
                    <div className='footer-icon-text'>
                        <img src={location_icon} alt="" className='location-icon' />
                        <p>{address}</p>
                    </div>
                    <div className='footer-icon-text'>
                        <img src={phone_icon} alt="" className='phone-icon' />
                        <p>{phoneNumber}</p>
                    </div>
                    <p>Email: {email}</p>
                </div>
                <div className='follow-us'>
                    <p className='footer-info'>Urmărește-ne</p>
                    <div className='footer-social-icon'>
                        <img src={instagram_icon} alt="" className='instagram-icon' />
                        <img src={pinterest_icon} alt="" className='pinterest-icon' />
                    </div>
                </div>
            </div>
            <div className='footer-copyright'>
                <hr />
                <p>Copyright @ 2024. Toate drepturile rezervate</p>
            </div>
        </footer>
    )
}

export default Footer;
