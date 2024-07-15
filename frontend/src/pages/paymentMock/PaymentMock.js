import React, { useState, useContext } from 'react';
import './PaymentMock.css';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentMock = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const navigate = useNavigate();
    const { clearCart } = useContext(ShopContext);

    const handlePayment = async (e) => {
        e.preventDefault();
        toast.success('Plata a fost procesată cu succes!');

        const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));

        try {
            const response = await fetch('http://localhost:4000/api/orders/addorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });

            const data = await response.json();
            if (data.success) {
                console.log('Order created:', data.order);
                sessionStorage.removeItem('orderDetails');
                clearCart();
                navigate('/order-success');
            } else {
                toast.error('Crearea comenzii a eșuat. Vă rugăm să încercați din nou.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('A apărut o eroare la crearea comenzii.');
        }
    };

    return (
        <div className="payment-mock">
            <h2>Detalii Plată cu Cardul</h2>
            <form onSubmit={handlePayment}>
                <div className="form-group">
                    <label>Număr Card:</label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Număr Card"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Data Expirării:</label>
                    <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>CVV:</label>
                    <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="CVV"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Numele de pe Card:</label>
                    <input
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="Numele de pe Card"
                        required
                    />
                </div>
                <button type="submit">Plătește</button>
            </form>
            <ToastContainer/>
        </div>
    );
};

export default PaymentMock;
