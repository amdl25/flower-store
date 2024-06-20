import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubscribe = async () => {
        if (!email) {
            setMessage('Te rog introdu o adresă de email.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/subscribers/addsubscriber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.success) {
                setMessage('Te-ai abonat cu succes!');
                setEmail('');
            } else {
                setMessage(data.message || 'A apărut o eroare. Te rugăm să încerci din nou.');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            setMessage('A apărut o eroare. Te rugăm să încerci din nou.');
        }
    };

    return (
        <div className='newsletter'>
            <h1>Abonați-vă la Floarea Lunii</h1>
            <p>Primiți lunar informații despre floarea lunii și semnificația ei.</p>
            <div className='newsletter-form'>
                <input 
                    type='email' 
                    placeholder='Adresa Dvs. de Email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSubscribe}>Abonare</button>
            </div>
            {message && <p className='newsletter-message'>{message}</p>}
        </div>
    );
}

export default Newsletter;
