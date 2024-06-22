import React, { useState, useEffect } from 'react';
import './ListPromoCode.css';
import cross_icon from '../../assets/cross_icon.png';

const ListPromoCode = () => {
    const [allPromoCodes, setAllPromoCodes] = useState([]);
    const [editingPromoCode, setEditingPromoCode] = useState(null);

    const fetchPromoCodes = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/promocodes/allpromocodes');
            const data = await response.json();
            setAllPromoCodes(data);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const removePromoCode = async (id) => {
        console.log(`Attempting to delete promo code with ID: ${id}`);
        try {
            const response = await fetch(`http://localhost:4000/api/promocodes/removepromocode`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            await fetchPromoCodes();
    
            if (response.ok) {
                console.log(`Promo code with ID: ${id} deleted successfully.`);
                fetchPromoCodes();
            } else {
                console.error(`Failed to delete promo code with ID: ${id}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error removing promo code:', error);
        }
    };
    

    const handleEdit = (promoCode) => {
        setEditingPromoCode(promoCode);
    };

    const handleSave = async (updatedPromoCode) => {
        try {
            await fetch('http://localhost:4000/api/promocodes/updatepromocode', {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPromoCode)
            });

            setEditingPromoCode(null);
            await fetchPromoCodes();
        } catch (error) {
            console.error('Error updating promo code:', error);
        }
    };

    return (
        <div className='list-promocode'>
            <h1>Listă coduri promoționale</h1>
            <div className='listpromocode-format-main'>
                <p>Cod</p>
                <p>Tip</p>
                <p>Valoare</p>
                <p>Dată expirare</p>
                <p>Limită utilizare</p>
                <p>Activ</p>
                <p>Criterii</p>
                <p>Acțiuni</p>
            </div>
            <div className="listpromocode-allpromocodes">
                <hr />
                {allPromoCodes.map((promoCode, index) => (
                    <React.Fragment key={index}>
                        <div className="listpromocode-format-main listpromocode-format">
                            <p>{promoCode.code}</p>
                            <p>{promoCode.discountType}</p>
                            <p>{promoCode.discountValue}{promoCode.discountType === 'procent' ? '%' : ' lei'}</p>
                            <p>{new Date(promoCode.expirationDate).toLocaleDateString()}</p>
                            <p>{promoCode.usageLimit}</p>
                            <p>{promoCode.isActive ? 'Da' : 'Nu'}</p>
                            <p>{promoCode.criteria || 'N/A'}</p>
                            <div className="listpromocode-actions">
                                <button onClick={() => handleEdit(promoCode)} className='edit-button'>Modifică</button>
                                <img onClick={() => { removePromoCode(promoCode.id) }} className='listpromocode-remove-icon' src={cross_icon} alt="Remove" />
                            </div>
                        </div>
                        <hr />
                    </React.Fragment>
                ))}
            </div>

            {editingPromoCode && (
                <>
                    <div className="edit-promocode-overlay" onClick={() => setEditingPromoCode(null)}></div>
                    <div className='edit-promocode-form'>
                        <h2>Editează cod promoționak</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave(editingPromoCode);
                        }}>
                            <label>Cod:</label>
                            <input
                                type="text"
                                value={editingPromoCode.code}
                                onChange={(e) => setEditingPromoCode({ ...editingPromoCode, code: e.target.value })}
                            />
                            <label>Tip:</label>
                            <select
                                value={editingPromoCode.discountType}
                                onChange={(e) => setEditingPromoCode({ ...editingPromoCode, discountType: e.target.value })}
                            >
                                <option value="percentage">Procent</option>
                                <option value="fixed">Sumă fixă</option>
                            </select>
                            <label>Valoare:</label>
                            <input
                                type="number"
                                value={editingPromoCode.discountValue}
                                onChange={(e) => setEditingPromoCode({ ...editingPromoCode, discountValue: parseFloat(e.target.value) })}
                            />
                            <label>Dată expirare:</label>
                            <input
                                type="date"
                                value={new Date(editingPromoCode.expirationDate).toISOString().substr(0, 10)}
                                onChange={(e) => setEditingPromoCode({ ...editingPromoCode, expirationDate: new Date(e.target.value) })}
                            />
                            <label>Limită utilizare:</label>
                            <input
                                type="number"
                                value={editingPromoCode.usageLimit}
                                onChange={(e) => setEditingPromoCode({ ...editingPromoCode, usageLimit: parseInt(e.target.value) })}
                            />
                            <label>Activ:</label>
                            <select
                                value={editingPromoCode.isActive ? 'yes' : 'no'}
                                onChange={(e) => setEditingPromoCode({ ...editingPromoCode, isActive: e.target.value === 'yes' })}
                            >
                                <option value="yes">Da</option>
                                <option value="no">Nu</option>
                            </select>
                            <label>Criterii aplicare:</label>
                            <select
                                value={editingPromoCode.criteria}
                                onChange={(e) => setEditingPromoCode({ ...editingPromoCode, criteria: e.target.value })}
                            >
                                <option value="">Selectează criteriul</option>
                                <option value="user_nou">Utilizator Nou</option>
                                <option value="loyal_customer">Client Loial (Peste 5 comenzi)</option>
                                <option value="special_event">Eveniment Special</option>
                                <option value="seasonal_offer">Ofertă de Sezon</option>
                            </select>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit">Salvare</button>
                                <button type="button" onClick={() => setEditingPromoCode(null)}>Anulare</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default ListPromoCode;
