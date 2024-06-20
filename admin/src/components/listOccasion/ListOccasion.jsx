import React, { useState, useEffect } from 'react';
import './ListOccasion.css';
import cross_icon from '../../assets/cross_icon.png';

const ListOccasion = () => {
    const [allOccasions, setAllOccasions] = useState([]);
    const [editingOccasion, setEditingOccasion] = useState(null);

    const fetchOccasions = async () => {
        await fetch('http://localhost:4000/api/occasions/alloccasions')
            .then((res) => res.json())
            .then((data) => { setAllOccasions(data); });
    }

    useEffect(() => {
        fetchOccasions();
    }, []);

    const removeOccasion = async (id) => {
        await fetch('http://localhost:4000/api/occasions/removeoccasion', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        fetchOccasions();
    }

    const handleEdit = (occasion) => {
        setEditingOccasion(occasion);
    }

    const handleSave = async (updatedOccasion) => {
        await fetch('http://localhost:4000/api/occasions/updateoccasion', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOccasion)
        });

        setEditingOccasion(null);
        await fetchOccasions();
    }

    return (
        <div className='list-occasion'>
            <h1>Lista ocaziilor</h1>
            <div className='listoccasion-format-main'>
                <p>Ocazie</p>
                <p>Acțiune</p>
            </div>
            <div className="listoccasion-alloccasions">
                <hr />
                {allOccasions.map((occasion, index) => (
                    <React.Fragment key={index}>
                        <div className="listoccasion-format-main listoccasion-format">
                            <p>{occasion.name}</p>
                            <div className="listoccasion-actions">
                                <button onClick={() => handleEdit(occasion)}>Modifică</button>
                                <img onClick={() => { removeOccasion(occasion.id) }} className='listoccasion-remove-icon' src={cross_icon} alt="Remove" />
                            </div>
                        </div>
                        <hr />
                    </React.Fragment>
                ))}
            </div>

            {editingOccasion && (
                <>
                    <div className="edit-occasion-overlay" onClick={() => setEditingOccasion(null)}></div>
                    <div className='edit-occasion-form'>
                        <h2>Editează ocazie</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave(editingOccasion);
                        }}>
                            <label>Nume:</label>
                            <input
                                type="text"
                                value={editingOccasion.name}
                                onChange={(e) => setEditingOccasion({ ...editingOccasion, name: e.target.value })}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit">Salvare</button>
                                <button type="button" onClick={() => setEditingOccasion(null)}>Anulare</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default ListOccasion;
