import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
    return (
        <div className='descriptionbox'>
            <div className='descriptionbox-navigator'>
                <div className='descriptionbox-nav-box'>Descriere</div>
            </div>
            <div className='descriptionbox-description'>
                <p className='description-text'>
                    Produsul pe care l-ați ales din florăria online Eden poate include o felicitare cadou, pe care vom scrie caligrafic textul ales de dumneavoastră, sau o cutie de bomboane. Serviciul de livrare flori este gratuit in Bucuresti și funcționează prin curieri proprii, astfel incât florile să ajungă în stare perfectă la destinatarul ales. În funcție de stoc și de sezon, produsele pot suferi mici modificări. Extraopțiunile sunt cu titlu de prezentare și nu sunt incluse în prețul produsului, insă acestea pot fi comandate alături de produsele dorite. Comanda acum in București, flori cu livrare gratuită! Pentru livrarile în țară, florile vor fi livrate de colaboratori locali. Produsele pot suferi modificări (tipul florilor, cutiile, ambalajele, alte materiale componente), în funcție de stocul colaboratorului local. Programul de livrare poate fi diferit în fiecare localitate. Simplu si frumos!
                </p>
            </div>
        </div>
    );
};

export default DescriptionBox;
