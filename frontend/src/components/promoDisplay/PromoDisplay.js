import React, { useState, useEffect } from 'react';
import './PromoDisplay.css';

const PromoDisplay = ({ promoCode, onClose, variant }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (promoCode) {
      setIsVisible(true);
    }
  }, [promoCode]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const renderContentBasedOnVariant = () => {
    switch (variant) {
      case 'newUser':
        return (
          <div className="promo-display-container newUser">
            <div className="promo-display">
              <button className="promo-close-btn" onClick={handleClose}>X</button>
              <h2>Bun venit, utilizator nou!</h2>
              <p>Folosiți codul de reducere <strong>{promoCode.code}</strong> pentru o reducere de {promoCode.discountValue}%.</p>
            </div>
          </div>
        );
      case 'loyalCustomer':
        return (
          <div className="promo-display-container loyalCustomer">
            <div className="promo-display">
              <button className="promo-close-btn" onClick={handleClose}>X</button>
              <h2>Bun venit, client fidel!</h2>
              <p>Folosiți codul de reducere <strong>{promoCode.code}</strong> pentru o reducere de {promoCode.discountValue} lei.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="promo-display-container default">
            <div className="promo-display">
              <button className="promo-close-btn" onClick={handleClose}>X</button>
              <h2>Bun venit!</h2>
              <p>Folosiți codul de reducere <strong>{promoCode.code}</strong> pentru o reducere specială.</p>
            </div>
          </div>
        );
    }
  };

  return (
    isVisible && renderContentBasedOnVariant()
  );
};

export default PromoDisplay;
