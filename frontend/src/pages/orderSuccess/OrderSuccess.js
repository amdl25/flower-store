import React from 'react';
import './OrderSuccess.css';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
    return (
        <div className="order-success-container">
            <FaCheckCircle className="success-icon" />
            <h1>Mulțumim că ați comandat de la noi!</h1>
            <p>Comanda a fost plasată cu succes. Va fi procesată în curând.</p>
        </div>
    );
};

export default OrderSuccess;
