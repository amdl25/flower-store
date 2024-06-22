import React, { useState, useEffect } from 'react';
import './PromoDisplay.css';

const PromoDisplay = ({ promoCodes, isMinimized, onToggle }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (promoCodes && promoCodes.length > 0) {
      setIsVisible(true);
    }
  }, [promoCodes]);

  const renderPromoCode = (promoCode) => {
    if (!promoCode) return null;

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
    isVisible && (
      <div className="promo-display-wrapper">
        {isMinimized ? (
          <div className="promo-minimized" onClick={onToggle}>
            <button className="promo-toggle-btn">&lt;</button>
          </div>
        ) : (
          <>
            {promoCodes.map(promoCode => renderPromoCode(promoCode))}
            <button className="promo-minimize-btn" onClick={onToggle}>X</button>
          </>
        )}
      </div>
    )
  );
};

export default PromoDisplay;
