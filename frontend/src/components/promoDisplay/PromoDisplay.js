import React, { useState, useEffect } from 'react';
import './PromoDisplay.css';

const PromoDisplay = ({ promoCodes = [], isMinimized, onToggle, isAuthenticated }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (promoCodes.length > 0) {
      setIsVisible(true);
    }
  }, [promoCodes]);

  const renderPromoCode = (promoCode) => {
    if (!promoCode) return null;

    if (!isAuthenticated) {
      if (promoCode.criteria === 'user_nou') {
        return (
          <div key={promoCode._id} className="promo-code-container ineligible">
            <p>Crează un cont pentru a beneficia de această ofertă: <strong>{promoCode.code}</strong> pentru {promoCode.discountValue}{promoCode.discountType === 'procent' ? '%' : ' lei'}.</p>
          </div>
        );
      } else if (promoCode.criteria === 'client_fidel') {
        return (
          <div key={promoCode._id} className="promo-code-container ineligible">
            <p>Crează un cont și plasează 5 comenzi pentru a beneficia de această ofertă: <strong>{promoCode.code}</strong> pentru {promoCode.discountValue}{promoCode.discountType === 'procent' ? '%' : ' lei'}</p>
          </div>
        );
      }
    }

    if (isAuthenticated && !promoCode.isEligible) {
      if (promoCode.criteria === 'user_nou') {
        return (
          <div key={promoCode._id} className="promo-code-container ineligible">
            <p>Nu ești eligibil pentru această ofertă. Devii eligibil ca utilizator nou în primele 7 zile de la înregistrare.</p>
          </div>
        );
      } else if (promoCode.criteria === 'client_fidel') {
        return (
          <div key={promoCode._id} className="promo-code-container ineligible">
            <p>Nu ești eligibil pentru această ofertă. Devii eligibil după ce ai plasat 5 comenzi sau mai multe.</p>
          </div>
        );
      }
    }

    return (
      <div key={promoCode._id} className={`promo-code-container ${promoCode.isEligible ? 'eligible' : 'ineligible'}`}>
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
