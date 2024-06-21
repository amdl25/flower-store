import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../context/ShopContext';
import remove_icon from '../images/cart_cross_icon.png';
import chocolate_box from '../images/chocolate_box.png';
import greeting_card from '../images/greeting_card.png';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart } = useContext(ShopContext);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [finalTotal, setFinalTotal] = useState(getTotalCartAmount());
    const navigate = useNavigate();

    useEffect(() => {
        if (discount) {
            let discountAmount = 0;
            if (discount.discountType === 'percentage') {
                discountAmount = (getTotalCartAmount() * discount.discountValue) / 100;
            } else if (discount.discountType === 'fixed') {
                discountAmount = discount.discountValue;
            }
            const newTotal = Math.max(0, getTotalCartAmount() - discountAmount);
            setFinalTotal(newTotal);
        } else {
            setFinalTotal(getTotalCartAmount());
        }
    }, [discount, getTotalCartAmount]);

    const handleIncreaseQuantity = (itemId) => {
        const product = all_product.find((prod) => prod.id === Number(itemId));
        if (product) {
            addToCart({
                productId: itemId,
                quantity: 1,
                date: cartItems[itemId].date,
                time: cartItems[itemId].time,
                greetingMessage: cartItems[itemId].greetingMessage,
                selectedOptions: cartItems[itemId].selectedOptions,
                additionalCost: cartItems[itemId].additionalCost
            });
        }
    };
    

    const applyPromoCode = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/promocodes/validatepromocode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: promoCode })
            });

            const data = await response.json();
            if (data.success) {
                setDiscount(data.promoCode);
                setErrorMessage('');
            } else {
                setErrorMessage(data.error);
                setDiscount(null);
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            setErrorMessage('An error occurred while applying the promo code.');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };
    

    return (
        <div className='cartitems'>
            <div className='cartitems-format-main'>
                <p>Produse</p>
                <p>Denumire</p>
                <p>Preț</p>
                <p>Opțiuni</p>
                <p>Cantitate</p>
                <p>Total</p>
                <p>Șterge</p>
            </div>
            <hr />
            {Object.keys(cartItems).map((itemId) => {
                const cartItem = cartItems[itemId];
                if (cartItem?.quantity > 0) {
                    const product = all_product.find((prod) => prod.id === Number(itemId));
                    if (product) {
                        const displayPrice = product.discountedPrice ? product.discountedPrice : product.price;
                        const totalPrice = (displayPrice + (cartItem.additionalCost || 0)) * cartItem.quantity;
                        return (
                            <div key={itemId}>
                                <div className='cartitems-format cartitems-format-main'>
                                    <img src={product.image} alt="" className='carticon-product-icon' />
                                    <p>{product.name}</p>
                                    <p>{displayPrice} lei</p>
                                    <div className='cart-item-options'>
                                        {cartItem.selectedOptions.chocolateBox || cartItem.selectedOptions.greetingCard ? (
                                            <>
                                                {cartItem.selectedOptions.chocolateBox && (
                                                    <div className='cart-item-option'>
                                                        <img src={chocolate_box} alt="Chocolate Box" className='cart-option-icon' />
                                                        <p>85 lei</p>
                                                    </div>
                                                )}
                                                {cartItem.selectedOptions.greetingCard && (
                                                    <div className='cart-item-option'>
                                                        <img src={greeting_card} alt="Greeting Card" className='cart-option-icon' />
                                                        <p>0 lei</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p>-</p> 
                                        )}
                                    </div>
                                    <div className='cartitems-quantity-container'>
                                        <button className='cartitems-quantity-btn' onClick={() => handleIncreaseQuantity(itemId)}>+</button>
                                        <span className='cartitems-quantity'>{cartItem.quantity}</span>
                                    </div>

                                    <p>{totalPrice} lei</p>
                                    <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(itemId) }}/>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                }
                return null;
            })}
            <div className='cartitems-down'>
                <div className='cartitems-total'>
                    <div>
                        <div className='cartitems-total-item'>
                            <p>Subtotal</p>
                            <p>{getTotalCartAmount()} lei</p>
                        </div>
                        <hr/>
                        <div className='cartitems-total-item'>
                            <p>Transport</p>
                            <p>Gratuit</p>
                        </div>
                        <hr/>
                        {discount && (
                            <div className='cartitems-total-item'>
                                <p>Discount</p>
                                <p>- {discount.discountType === 'percentage' ? `${discount.discountValue}%` : `${discount.discountValue} lei`}</p>
                            </div>
                        )}
                        <hr/>
                        <div className='cartitems-total-item'>
                            <h3>Total</h3>
                            <h3>{finalTotal} lei</h3>
                        </div>
                    </div>
                    <button onClick={handleCheckout}>Finalizare</button>
                </div>
                <div className='cartitems-promocode'>
                    <p>Introdu aici codul de reducere</p>
                    <div className='cartitems-promobox'>
                        <input 
                            type="text" 
                            placeholder='Cod reducere' 
                            value={promoCode} 
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button onClick={applyPromoCode}>Adaugă</button>
                    </div>
                    {errorMessage && <p className='promocode-error'>{errorMessage}</p>}
                    {discount && <p className='promocode-success'>Cod de reducere aplicat: {discount.code} - {discount.discountType === 'percentage' ? `${discount.discountValue}%` : `${discount.discountValue} lei`}</p>}
                </div>
            </div>
        </div>
    );
};

export default CartItems;
