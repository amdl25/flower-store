import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    return {};
}

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [loading, setLoading] = useState(true);
    const [promoCode, setPromoCode] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    useEffect(() => {
        const fetchCartData = async () => {
            if (localStorage.getItem('auth-token')) {
                try {
                    const response = await fetch('http://localhost:4000/api/cart/getcart', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Fetched cart data:', data.cartData);
                        setCartItems(data.cartData);
                    } else {
                        console.error('Failed to fetch cart:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            } else {
                setCartItems(getDefaultCart());
            }
        };
    
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/products/allproducts');
                const data = await response.json();
                console.log('Fetched products:', data);
                setAll_Product(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
        fetchCartData();
    }, []);

    const applyPromoCode = (promo) => {
        setPromoCode(promo);
        let discount = 0;
        if (promo.discountType === 'procent') {
            discount = (getTotalCartAmount() * promo.discountValue) / 100;
        } else if (promo.discountType === 'sumă fixă') {
            discount = promo.discountValue;
        }
        setDiscountAmount(discount);
        console.log('Promo Code Applied in Context:', promo);
    };
    
    const clearPromoCode = () => {
        setPromoCode(null);
        setDiscountAmount(0);
        console.log('Promo Code Cleared in Context');
    };

    const addToCart = (productDetails) => {
        setCartItems((prev) => ({
            ...prev,
            [productDetails.productId]: {
                ...(prev[productDetails.productId] || {}),
                quantity: (prev[productDetails.productId]?.quantity || 0) + 1,
                date: productDetails.date,
                time: productDetails.time,
                greetingMessage: productDetails.greetingMessage,
                selectedOptions: productDetails.selectedOptions,
                additionalCost: productDetails.additionalCost
            }
        }));

        const token = localStorage.getItem('auth-token');
    
        if (token) {
            const apiUrl = 'http://localhost:4000/api/cart/addtocart';
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(productDetails)
            };
    
            fetch(apiUrl, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to add to cart');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Add to cart response:', data);
                })
                .catch((error) => console.error('Error adding to cart:', error));
        } else {
            let cart = JSON.parse(localStorage.getItem('cart')) || {};
            const { productId } = productDetails;
    
            if (cart[productId]) {
                cart[productId].quantity += 1;
            } else {
                cart[productId] = {
                    quantity: 1,
                    ...productDetails
                };
            }
    
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Product added to local cart:', cart);
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId]) {
                updatedCart[itemId].quantity = Math.max((updatedCart[itemId].quantity || 0) - 1, 0);
                if (updatedCart[itemId].quantity === 0) {
                    delete updatedCart[itemId];
                }
            }
            return updatedCart;
        });
    
        const token = localStorage.getItem('auth-token');
        if (token) {
            fetch('http://localhost:4000/api/cart/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "itemId": itemId })
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.errors) {
                    console.error('Remove from cart error:', data.errors);
                } else {
                    console.log('Remove from cart response:', data);
                }
            })
            .catch((error) => console.error('Error removing from cart:', error));
        } else {
            console.error('No token available. User might not be authenticated.');
        }
    };

    const clearCart = () => {
        setCartItems(getDefaultCart());
        console.log('Cart cleared:', getDefaultCart());
    };
    
    const logout = () => {
        localStorage.removeItem('auth-token');
        clearCart();
        console.log("Logged out and cleared cart");
    };

    const getTotalCartAmount = useCallback(() => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId]?.quantity > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(itemId));
                if (itemInfo) {
                    const price = itemInfo.discountedPrice || itemInfo.price;
                    const optionCost = cartItems[itemId].additionalCost || 0;
                    totalAmount += (price + optionCost) * cartItems[itemId].quantity;
                }
            }
        }
        return totalAmount;
    }, [cartItems, all_product]);
    
    const getTotalCartItems = useCallback(() => {
        let totalItem = 0;
        for(const itemId in cartItems) {
            if(cartItems[itemId]?.quantity > 0) {
                totalItem += cartItems[itemId].quantity;
            }
        }
        console.log('Total items in cart:', totalItem);
        return totalItem;
    }, [cartItems]);

    const contextValue = { 
        getTotalCartItems, 
        getTotalCartAmount, 
        all_product, 
        cartItems, 
        addToCart, 
        removeFromCart,
        clearCart, 
        logout,
        applyPromoCode,
        clearPromoCode,
        promoCode
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
