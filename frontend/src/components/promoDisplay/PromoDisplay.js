import React, { useState, useEffect } from 'react';
import './PromoDisplay.css';

const PromoDisplay = ({ promoCodes = [], isMinimized, onToggle, isAuthenticated }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    if (promoCodes.length > 0) {
      setIsVisible(true);
    }

    const storedEmail = localStorage.getItem('user-email');
    if (storedEmail) {
      setUserEmail(storedEmail.replace(/\./g, '_'));
    }
  }, [promoCodes]);

  const hasExceededUsageLimit = (promoCode) => {
    if (userEmail && promoCode.usageHistory) {
      const usageCount = promoCode.usageHistory[userEmail] || 0;
      return usageCount >= promoCode.usageLimit;
    }
    return false;
  };

  const renderPromoCode = (promoCode) => {
    if (!promoCode) return null;

    if (isAuthenticated && hasExceededUsageLimit(promoCode)) {
      return null;
    }

    if (!isAuthenticated) {
      if (promoCode.criteria === 'user_nou') {
        return (
          <div key={promoCode._id} className="promo-code-container ineligible">
            <p>Crează-ți cont pentru a beneficia de {promoCode.discountValue}{promoCode.discountType === 'procent' ? '%' : ' lei'} reducere la următoarea comandă.</p>
          </div>
        );
      }
    }

    if (isAuthenticated) {
      if (promoCode.isEligible) {
        return (
          <div key={promoCode._id} className="promo-code-container eligible">
            <div className="promo-code-header">
              {promoCode.criteria === 'user_nou' && <h2>Bun venit!</h2>}
              {promoCode.criteria === 'client_fidel' && <h2>Bun venit!</h2>}
              {!['user_nou', 'client_fidel'].includes(promoCode.criteria) && <h2>Bun venit!</h2>}
            </div>
            <p>Folosiți codul de reducere <strong>{promoCode.code}</strong> pentru o reducere de {promoCode.discountValue}{promoCode.discountType === 'procent' ? '%' : ' lei'}.</p>
          </div>
        );
      } else {
        if (promoCode.criteria === 'user_nou') {
          return (
            <div key={promoCode._id} className="promo-code-container ineligible">
              <p>Nu ești eligibil pentru această ofertă. Devii eligibil ca utilizator nou în primele 7 zile de la înregistrare.</p>
            </div>
          );
        }
      }
    }

    return null;
  };

  return (
    isVisible && (
      <div className="promo-display-wrapper">
        {isMinimized ? (
          <div className="promo-minimized" onClick={onToggle}>
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
            <button className="promo-minimize-btn" onClick={onToggle}>&lt;</button>
          </div>
        )}
      </div>
    )
  );
};

export default PromoDisplay;
