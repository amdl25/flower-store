import React from 'react'
import Hero from '../components/hero/Hero'
import DiscountCollection from '../components/discountCollection/DiscountCollection'
import NewCollection from '../components/newCollection/NewCollection'
import Offer from '../components/offer/Offer'
import Newsletter from '../components/newsletter/Newsletter'


const Acasa = () => {
    return (
        <div>
            <Hero/>
            <DiscountCollection/>
            <NewCollection/>
            <Offer/> 
            <Newsletter/>     
        </div>
    )
}

export default Acasa