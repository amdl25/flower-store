import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginSignup.css';

const LoginSignup = ({ onLogin, onSignup, isAuthenticated }) => {
    const [state, setState] = useState("Autentificare");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    });
    const [showTermsError, setShowTermsError] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
        if (showTermsError && e.target.checked) {
            setShowTermsError(false);
        }
    };

    const login = async () => {
        let responseData;
        try {
            const response = await fetch('http://localhost:4000/api/user/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            responseData = await response.json();
    
            if (responseData.success) {
                localStorage.setItem('auth-token', responseData.token);
                localStorage.setItem('user-email', responseData.user.email);
                onLogin({ email: responseData.user.email, name: responseData.user.name, address: responseData.user.address });
                navigate('/profil');
            } else {
                toast.error(responseData.errors || "Autentificarea a eșuat. Vă rugăm să încercați din nou.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("A apărut o eroare la autentificare. Vă rugăm să încercați din nou.");
        }
    };

    const signup = async () => {
        let responseData;
        try {
            const response = await fetch('http://localhost:4000/api/user/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            responseData = await response.json();
    
            if (responseData.success) {
                localStorage.setItem('auth-token', responseData.token);
                localStorage.setItem('user-email', responseData.user.email);
                onSignup({ email: formData.email, name: formData.username });
                navigate('/profil');
            } else {
                toast.error(responseData.errors || "Înregistrarea a eșuat. Vă rugăm să încercați din nou.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("A apărut o eroare la înregistrare. Vă rugăm să încercați din nou.");
        }
    };

    const handleContinueClick = () => {
        if (!termsAccepted) {
            setShowTermsError(true);
        } else {
            state === "Autentificare" ? login() : signup();
        }
    };

    if (isAuthenticated) {
        setTimeout(() => {
            navigate('/profil');
        }, 0);
        return null;
    }

    return (
        <div className='loginsignup'>
            <div className='loginsignup-container'>
                <h1>{state}</h1>
                <div className='loginsignup-fields'>
                    {state === "Creare cont" ? (
                        <input name='username' value={formData.username} onChange={changeHandler} type='text' placeholder='Nume' />
                    ) : null}
                    <input name='email' value={formData.email} onChange={changeHandler} type='email' placeholder='Email' />
                    <input name='password' value={formData.password} onChange={changeHandler} type='password' placeholder='Parola' />
                </div>
                <div className='loginsignup-agree'>
                    <input type='checkbox' checked={termsAccepted} onChange={handleTermsChange} />
                    <p>Sunt de acord cu termenii de utilizare și politica de confidențialitate.</p>
                </div>
                {showTermsError && <p className="warning">Trebuie să acceptați termenii și condițiile pentru a continua.</p>}
                <button type='button' onClick={handleContinueClick}>Continuă</button>
                {state === 'Creare cont' ? <p className='loginsignup-login'>Ai deja un cont? <span onClick={() => { setState("Autentificare") }}>Autentifică-te aici</span></p>
                    : <p className='loginsignup-login'>Nu ai cont? <span onClick={() => { setState("Creare cont") }}>Creează-ți cont aici</span></p>
                }
            </div>
            <ToastContainer />
        </div>
    );
};

export default LoginSignup;
