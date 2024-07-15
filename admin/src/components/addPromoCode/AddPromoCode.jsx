import React, { useState } from 'react';
import './AddPromoCode.css';

const AddPromoCode = () => {
    const [promoCodeData, setPromoCodeData] = useState({
        code: '',
        discountType: 'procent',
        discountValue: '',
        expirationDate: '',
        usageLimit: 1,
         criteria: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromoCodeData({
            ...promoCodeData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/promocodes/addpromocode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promoCodeData)
            });

            const data = await response.json();
            if (data.success) {
                alert('Cod de reducere adăugat cu succes');
                setPromoCodeData({
                    code: '',
                    discountType: 'procent',
                    discountValue: '',
                    expirationDate: '',
                    usageLimit: 1,
                    criteria: ''
                });
            } else {
                console.error('Error adding promo code:', data.error);
                alert('Eroare la adăugarea codului de reducere: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding promo code:', error);
            alert('Eroare la adăugarea codului de reducere');
        }
    };

    return (
        <div className="addpromocode">
            <form onSubmit={handleSubmit}>
                <div className="addpromocode-itemfield">
                    <label>Cod promoțional</label>
                    <input
                        type="text"
                        name="code"
                        value={promoCodeData.code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="addpromocode-itemfield">
                    <label>Tip discount</label>
                    <select
                        name="discountType"
                        value={promoCodeData.discountType}
                        onChange={handleChange}
                        required
                    >
                        <option value="procent">Procent</option>
                        <option value="sumă fixă">Sumă fixă</option>
                    </select>
                </div>
                <div className="addpromocode-itemfield">
                    <label>Valoare discount</label>
                    <input
                        type="number"
                        name="discountValue"
                        value={promoCodeData.discountValue}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="addpromocode-itemfield">
                    <label>Dată expirare</label>
                    <input
                        type="date"
                        name="expirationDate"
                        value={promoCodeData.expirationDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="addpromocode-itemfield">
                    <label>Limită utilizare</label>
                    <input
                        type="number"
                        name="usageLimit"
                        value={promoCodeData.usageLimit}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>
                <div className="addpromocode-itemfield">
                    <label>Criterii aplicare</label>
                    <select
                        name="criteria"
                        value={promoCodeData.criteria}
                        onChange={(e) => setPromoCodeData({ ...promoCodeData, criteria: e.target.value })}
                        required
                    >
                        <option value="">Selectează criteriul</option>
                        <option value="user_nou">Utilizator Nou</option>
                        <option value="loyal_customer">Client Loial (Peste 5 comenzi)</option>
                    </select>
                </div>
                <button type="submit" className="addpromocode-btn">Adaugă cod promo</button>
            </form>
        </div>
    );
};

export default AddPromoCode;
