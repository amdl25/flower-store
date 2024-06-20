import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../images/breadcrum_arrow.png';

const Breadcrum = (props) => {
    const { produs } = props;

    const categoryMapping = {
        'buchete': 'Buchete',
        'cosuri-flori': 'Coșuri cu flori',
        'flori-criogenate': 'Flori criogenate',
        'flori-cutii': 'Flori în cutii'
    };

    const categoryName = categoryMapping[produs.category] || produs.category;

    return (
        <div className='breadcrum'>
            Produse <img src={arrow_icon} alt=""/>
            {categoryName} <img src={arrow_icon} alt=""/> {produs.name}
        </div>
    );
}

export default Breadcrum;
