import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../context/ShopContext';
import remove_icon from '../images/cart_cross_icon.png';
import chocolate_box from '../images/chocolate_box.png';
import greeting_card from '../images/greeting_card.png';
import Item from '../item/Item';

const CartItems = ({ promoCodes = [] }) => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart, clearPromoCode, applyPromoCode: contextApplyPromoCode } = useContext(ShopContext);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [finalTotal, setFinalTotal] = useState(getTotalCartAmount());
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const navigate = useNavigate();

    const isCartEmpty = Object.keys(cartItems).every(key => cartItems[key] === 0);

    useEffect(() => {
        console.log('Promo Codes in CartItems:', promoCodes);
    }, [promoCodes]);

    useEffect(() => {
        if (discount) {
            let calculatedDiscountAmount = 0;
            if (discount.discountType === 'procent') {
                calculatedDiscountAmount = (getTotalCartAmount() * discount.discountValue) / 100;
            } else if (discount.discountType === 'sumă fixă') {
                calculatedDiscountAmount = discount.discountValue;
            }
            const newTotal = Math.max(0, getTotalCartAmount() - calculatedDiscountAmount);

            console.log('Subtotal:', getTotalCartAmount());
            console.log('Discount Amount:', calculatedDiscountAmount);
            console.log('New Total:', newTotal);

            setDiscountAmount(calculatedDiscountAmount);
            setFinalTotal(newTotal);
        } else {
            setDiscountAmount(0);
            setFinalTotal(getTotalCartAmount());
        }
    }, [discount, getTotalCartAmount]);

    useEffect(() => {
        if (isCartEmpty) {
            const getRandomProducts = (numProducts) => {
                const filteredProducts = all_product.filter(product => product.category === 'buchete' && !product.isSurprise);
                const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
                return shuffled.slice(0, numProducts);
            };
            setSuggestedProducts(getRandomProducts(3));
        }
    }, [isCartEmpty, all_product]);

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

    const handlePromoCodeSubmit = async () => {
        const enteredCode = promoCode.toUpperCase().trim();
        const promo = promoCodes.find(code => code.code.toUpperCase() === enteredCode);
        console.log('Promo Code Found:', promo);
    
        if (!promo) {
            setErrorMessage('Cod promoțional invalid.');
            setDiscount(null);
            clearPromoCode();
            return;
        }
    
        if (!promo.isEligible) {
            setErrorMessage('Nu sunteți eligibil pentru acest cod promoțional.');
            setDiscount(null);
            clearPromoCode();
            return;
        }
    
        try {
            const userEmail = localStorage.getItem('user-email');
    
            if (!userEmail) {
                setErrorMessage('Email-ul utilizatorului nu este disponibil.');
                return;
            }
    
            const response = await fetch('http://localhost:4000/api/promocodes/usage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                },
                body: JSON.stringify({ code: enteredCode, email: userEmail })
            });
    
            const usageData = await response.json();
            const userUsageCount = usageData.usageCount || 0;
    
            if (userUsageCount >= promo.usageLimit) {
                setErrorMessage('Ați atins limita de utilizare pentru acest cod promoțional.');
                setDiscount(null);
                clearPromoCode();
                return;
            }
    
            const validateResponse = await fetch('http://localhost:4000/api/promocodes/validatepromocode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                },
                body: JSON.stringify({ code: enteredCode })
            });
    
            const data = await validateResponse.json();
            if (validateResponse.ok && data.success) {
                setDiscount(data.promoCode);
                setErrorMessage('');
                contextApplyPromoCode(data.promoCode);
                console.log('Promo Code Applied:', data.promoCode);
            } else {
                setErrorMessage(data.error || 'Cod promoțional invalid.');
                setDiscount(null);
                clearPromoCode();
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            setErrorMessage('A apărut o eroare la aplicarea codului promoțional.');
            clearPromoCode();
        }
    };
    

    const handleCheckout = async () => {
        if (isCartEmpty) {
            setErrorMessage('Nu aveți niciun produs în coș.');
            return;
        }
    
        const orderedFlowers = Object.keys(cartItems).map(itemId => ({
            flowerId: itemId,
            quantity: cartItems[itemId].quantity
        }));
    
        try {
            const response = await fetch('http://localhost:4000/api/flowers/decreasequantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({ orderedFlowers })
            });
    
            if (response.ok) {
                navigate('/checkout');
            } else {
                const error = await response.json();
                setErrorMessage(error.message || 'An error occurred during checkout.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            setErrorMessage('A apărut o eroare la finalizarea comenzii.');
        }
    };
    

    return (
        <div className='cartitems'>
            {isCartEmpty ? (
                <>
                <div className='cart-empty-message-container card'>
                    <h2>Coș de cumpărături</h2>
                    <p className='cart-empty-message'>Nu aveți niciun produs în coș.
                        <br />
                        Dacă doriți un anumit buchet, vă sugerăm să navigați începând de <Link to="/produse">aici</Link>.
                        <br />
                        Iată câteva dintre recomandările noastre de buchete:
                    </p>
                </div>
                    <div className='suggested-products'>
                        <div className='suggested-products-list'>
                            {suggestedProducts.map(product => (
                                <Item
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    image={product.image}
                                    new_price={product.discountedPrice ? product.discountedPrice : product.price}
                                    old_price={product.discountedPrice ? product.price : null}
                                    price={product.price}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
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

                    {isCartEmpty && <p className='cart-empty-message'>Nu aveți niciun produs în coș.</p>}

                    <div className='cartitems-down'>
                        <div className='cartitems-total'>
                            <div>
                                <div className='cartitems-total-item'>
                                    <p>Subtotal</p>
                                    <p>{getTotalCartAmount().toFixed(2)} lei</p>
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
                                        <p>- {discountAmount.toFixed(2)} lei</p>
                                    </div>
                                )}
                                <hr/>
                                <div className='cartitems-total-item'>
                                    <h3>Total</h3>
                                    <h3>{finalTotal.toFixed(2)} lei</h3>
                                </div>
                            </div>
                            <button onClick={handleCheckout}>Finalizare comandă</button>
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
                                <button onClick={handlePromoCodeSubmit}>Adaugă</button>
                            </div>
                            {errorMessage && <p className='promocode-error'>{errorMessage}</p>}
                            {discount && <p className='promocode-success'>Cod de reducere aplicat: {discount.code} - {discount.discountType === 'percentage' ? `${discount.discountValue}%` : `${discount.discountValue} lei`}</p>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartItems;
