import React, { useState, useEffect } from 'react';
import './PromoDisplay.css';

const PromoDisplay = ({ promoCodes = [], isMinimized, onToggle }) => {
  useEffect(() => {
    console.log('PromoDisplay mounted with promoCodes:', promoCodes);
  }, [promoCodes]);

  const handleToggle = () => {
    console.log('Toggling promo display');
    onToggle();
  };

  const renderPromoCode = (promoCode) => {
    if (!promoCode) return null;

    console.log('Rendering promo code:', promoCode);

    return (
      <div key={promoCode._id} className="promo-code-container">
        <div className="promo-code-header">
          {promoCode.criteria === 'user_nou' && <h2>Bun venit, utilizator nou!</h2>}
          {promoCode.criteria === 'client_fidel' && <h2>Bun venit, client fidel!</h2>}
          {promoCode.criteria === 'special_event' && <h2>Eveniment Special!</h2>}
          {promoCode.criteria === 'seasonal_offer' && <h2>Ofertă de Sezon!</h2>}
          {!['user_nou', 'client_fidel', 'special_event', 'seasonal_offer'].includes(promoCode.criteria) && <h2>Bun venit!</h2>}
        </div>
        <p>Folosiți codul de reducere <strong>{promoCode.code}</strong> pentru o reducere de {promoCode.discountValue}{promoCode.discountType === 'procent' ? '%' : ' lei'}.</p>
      </div>
    );
  };

  return (
    <div className="promo-display-wrapper">
      {isMinimized ? (
        <div className="promo-minimized" onClick={handleToggle}>
          <button className="promo-toggle-btn">&lt;</button>
        </div>
      ) : (
        <div className="promo-display">
          {promoCodes.length > 0 ? (
            promoCodes.map(promoCode => renderPromoCode(promoCode))
          ) : (
            <div className="no-promo-codes">
              <p>Nu există coduri promoționale disponibile în acest moment.</p>
            </div>
          )}
          <button className="promo-minimize-btn" onClick={handleToggle}>X</button>
        </div>
      )}
    </div>
  );
};

export default PromoDisplay;
