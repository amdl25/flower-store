import React, { useContext, useState, useEffect } from 'react';
import Select from 'react-select';
import './ProductDisplay.css';
import { ShopContext } from '../../context/ShopContext';
import greeting_card from '../../components/images/greeting_card.png';
import chocolate_box from '../../components/images/chocolate_box.png';
import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDisplay = (props) => {
    const { produs } = props;
    const { addToCart: addToCartContext, cartItems, getTotalCartItems } = useContext(ShopContext);
    const [date, setDate] = useState(null);
    const [selectedTimeOption, setSelectedTimeOption] = useState(null);
    const [greetingMessage, setGreetingMessage] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [flowerDetails, setFlowerDetails] = useState([]);
    const [insufficientStock, setInsufficientStock] = useState(false);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [quantity, setQuantity] = useState(1);


    const [selectedOptions, setSelectedOptions] = useState({
        greetingCard: false,
        chocolateBox: false
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (produs && produs.flowers) {
            fetch('http://localhost:4000/api/flowers/allflowers')
                .then(response => response.json())
                .then(allFlowers => {
                    const details = produs.flowers.map(pFlower => {
                        const flower = allFlowers.find(f => f.id === pFlower.flower);
                        return {
                            ...flower,
                            includedQuantity: pFlower.quantity
                        };
                    });
                    setFlowerDetails(details);

                    const maxQuantities = details.map(flower => Math.floor(flower.quantity / flower.includedQuantity));
                    const maxAllowed = Math.min(...maxQuantities);
                    setMaxQuantity(maxAllowed);

                    const insufficient = maxAllowed === 0;
                    setInsufficientStock(insufficient);
                })
                .catch(error => {
                    console.error('Error fetching flower details:', error);
                });
        }
    }, [produs]);

    const handleTimeOptionChange = (selectedOption) => {
        setSelectedTimeOption(selectedOption);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleGreetingMessageChange = (e) => {
        setGreetingMessage(e.target.value);
    };

    const toggleOption = (option) => {
        setSelectedOptions({
            ...selectedOptions,
            [option]: !selectedOptions[option]
        });
    };

    const timeOptions = [
        { value: '08-14', label: '08-14' },
        { value: '14-20', label: '14-20' }
    ];

    const areRequiredFieldsFilled = date && selectedTimeOption && (!selectedOptions.greetingCard || greetingMessage);

    const handleAddToCart = () => {
        if (areRequiredFieldsFilled) {
            const totalQuantityInCart = getTotalCartItems();
            const currentProductQuantityInCart = cartItems[produs.id]?.quantity || 0;
            const newTotalQuantity = totalQuantityInCart + quantity - currentProductQuantityInCart;

            if (insufficientStock || maxQuantity <= 0 || newTotalQuantity > maxQuantity) {
                toast.error('Stoc insuficient pentru una sau mai multe flori. Vă rugăm să verificați disponibilitatea.', {
                    className: 'custom-toast-stock'
                });
                return;
            }

            let additionalCost = 0;
            if (selectedOptions.chocolateBox) {
                additionalCost += 85;
            }

            const productDetails = {
                productId: produs.id,
                date,
                time: selectedTimeOption.value,
                greetingMessage: selectedOptions.greetingCard ? greetingMessage : null,
                selectedOptions,
                additionalCost,
                quantity
            };

            addToCartContext(productDetails, maxQuantity);
    
            setShowWarning(false);
        } else {
            setShowWarning(true);
        }
    };

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => Math.min(prevQuantity + 1, maxQuantity));
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
    };
    
    const displayNewPrice = produs.discountedPrice || produs.price;
    const displayOldPrice = produs.discountedPrice ? produs.price : null;

    return (
        <div className='productdisplay'>
            <div className='productdisplay-left'>
                <div className='productdisplay-img-list'>
                    <img src={produs.image} alt="Product" />
                </div>

                <div className='productdisplay-img'>
                    <img 
                        className={`productdisplay-main-img ${produs.id === 'surprise' ? 'productdisplay-main-img-surprise' : ''}`} 
                        src={produs.image} 
                        alt="Product" 
                    />
                </div>
            </div>

            <div className='productdisplay-right'>
                <h1>{produs.name}</h1>

               {produs.isSurprise ? (
                    <div className='productdisplay-surprise-message'>
                    Conține un număr de 15 flori dintre cele disponibile.
                </div>
                ) : (
                    produs.category !== 'flori-criogenate' && (
                        <div className='productdisplay-right-flowers'>
                            <h2>Flori incluse:</h2>
                            {flowerDetails.length > 0 ? (
                                <ul>
                                    {flowerDetails.map(flower => (
                                        <li key={flower.id}>
                                            {flower.name} - {flower.includedQuantity} bucăți ({flower.quantity} disponibile)
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No flowers included</p>
                            )}
                        </div>
                    )
                )}
                <div className='productdisplay-right-prices'>
                    {displayOldPrice && <div className='productdisplay-right-price-old'>{displayOldPrice} lei</div>}
                    <div className='productdisplay-right-price-new'>{displayNewPrice} lei</div>
                </div>

                <div className='productdisplay-right-option'>
                    <h1>Adaugă o opțiune</h1>
                    <div className='productdisplay-right-options'>
                        <div className="productdisplay-option" onClick={() => toggleOption('greetingCard')}>
                            <img src={greeting_card} alt="Greeting Card" />
                            <input type="checkbox" checked={selectedOptions.greetingCard} readOnly />
                            <div className="option-price">0 lei</div>
                        </div>
                        <div className="productdisplay-option" onClick={() => toggleOption('chocolateBox')}>
                            <img src={chocolate_box} alt="Chocolate Box" />
                            <input type="checkbox" checked={selectedOptions.chocolateBox} readOnly />
                            <div className="option-price">85 lei</div>
                        </div>
                    </div>
                </div>

                {selectedOptions.greetingCard && (
                    <div className='productdisplay-right-message'>
                        <h1>Text pentru felicitare</h1>
                        <input 
                            type="text" 
                            placeholder="" 
                            className="greeting-message" 
                            value={greetingMessage}
                            onChange={handleGreetingMessageChange}
                        />
                    </div>
                )}
                {insufficientStock ? (
                    <div className='productdisplay-insufficient-stock'>
                        <p>Stoc insuficient pentru una sau mai multe flori din aranjament.</p> 
                    </div>
                ) : (
                    <>
                        <div className='productdisplay-right-delivery-container'>
                            <div className="productdisplay-right-delivery">
                                <h1>Alegeți data și ora livrării</h1>
                                <div className="productdisplayright-datetimepicker">
                                    <input type="date" onChange={handleDateChange} onMouseDown={(e) => e.preventDefault()} />
                                    <div className="custom-select">
                                        <Select 
                                            value={selectedTimeOption} 
                                            onChange={handleTimeOptionChange} 
                                            options={timeOptions}
                                            placeholder="" 
                                            className="custom-select"
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='productdisplay-right-controls'>
                        <div className='quantity-selector'>
                            <div className='quantity-input-container'>
                                <button onClick={decrementQuantity}>-</button>
                                <div className='quantity-input-wrapper'>
                                    <input 
                                        type="number" 
                                        value={quantity} 
                                        min="1" 
                                        max={maxQuantity} 
                                        readOnly 
                                    />
                                </div>
                                <button onClick={incrementQuantity}>+</button>
                            </div>
                        </div>


                            <button onClick={handleAddToCart} className='add-to-cart-button'>
                                Adaugă în coș
                            </button>
                        </div>
                        {showWarning && (
                            <p className='warning'>Vă rugăm să selectați data și ora livrării. Dacă alegeți opțiunea de felicitare, completați și textul pentru felicitare.</p>
                        )}
                    </>
                )}
                <ToastContainer />  
            </div>
        </div>
    );
}

export default ProductDisplay;
