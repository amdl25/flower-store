import React from 'react'
import CartItems from '../components/cartItems/CartItems'

const Cart = ({promoCodes = []}) => {
    return (
        <div>
            <CartItems promoCodes={promoCodes}/>
        </div>
    )
}

export default Cart