import React, { useState, useContext, useEffect } from 'react';
import './Checkout.css';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, all_product, getTotalCartAmount, clearCart, promoCode } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        paymentMethod: 'Card de Credit',
        deliveryMethod: 'livrare'
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Cart Items:', cartItems);
        console.log('All Products:', all_product);
        console.log('Applied Promo Code:', promoCode);
    }, [cartItems, all_product, promoCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.deliveryMethod === 'livrare' && formData.address.trim() === '') {
            setErrorMessage('Introduceți adresa de livrare');
            return;
        }

        const productsInCart = Object.keys(cartItems).map(productId => {
            const cartItem = cartItems[productId];
            if (cartItem && cartItem.quantity > 0) {
                return {
                    productId: parseInt(productId, 10),
                    quantity: cartItem.quantity,
                    date: cartItem.date,
                    time: cartItem.time,
                    greetingMessage: cartItem.greetingMessage,
                    selectedOptions: cartItem.selectedOptions
                };
            }
            return null;
        }).filter(product => product !== null);

        const orderDetails = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            paymentMethod: formData.paymentMethod,
            deliveryMethod: formData.deliveryMethod,
            products: productsInCart,
            totalAmount: getTotalCartAmount(),
            promoCode: promoCode ? promoCode.code : null
        };

        if (formData.deliveryMethod === 'livrare') {
            orderDetails.address = formData.address;
        }

        if (formData.paymentMethod === 'Card de Credit') {
            sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            navigate('/payment');
            return;
        }

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
                clearCart();
                navigate('/order-success');
            } else {
                setErrorMessage('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            setErrorMessage('An error occurred while creating the order.');
        }
    };

    return (
        <div className="checkout-container">
            <h1 className="checkout-header">Completează Detaliile Comenzii</h1>
            <form onSubmit={handleSubmit}>
                <div className="checkout-field">
                    <label htmlFor="name">Nume</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Introdu numele"
                        required
                    />
                </div>
                
                <div className="checkout-field">
                    <label htmlFor="deliveryMethod">Metodă de Livrare</label>
                    <select
                        id="deliveryMethod"
                        name="deliveryMethod"
                        value={formData.deliveryMethod}
                        onChange={handleChange}
                    >
                        <option value="livrare">Livrare la domiciliu</option>
                        <option value="ridicare personala">Ridicare personală de la sediu</option>
                    </select>
                </div>

                {formData.deliveryMethod === 'livrare' && (
                    <div className="checkout-field">
                        <label htmlFor="address">Adresă</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Introdu adresa"
                            required={formData.deliveryMethod === 'livrare'}
                        />
                    </div>
                )}

                <div className="checkout-field">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Introdu email-ul"
                        required
                    />
                </div>
                <div className="checkout-field">
                    <label htmlFor="phone">Telefon</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Introdu numărul de telefon"
                        required
                    />
                </div>
                <div className="checkout-field">
                    <label htmlFor="paymentMethod">Metodă de Plată</label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >
                        <option value="Card de Credit">Card de Credit</option>
                        {formData.deliveryMethod === 'livrare' && (
                            <option value="Ramburs">Ramburs</option>
                        )}
                        {formData.deliveryMethod === 'ridicare personala' && (
                            <option value="Plata la sediu">Plata la sediu</option>
                        )}
                    </select>
                </div>
                {errorMessage && <p className='checkout-error'>{errorMessage}</p>}
                <button type="submit" className="checkout-btn">Trimite Comanda</button>
            </form>
        </div>
    );
};

export default Checkout;
