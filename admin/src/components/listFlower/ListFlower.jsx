import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ListFlower.css';
import cross_icon from '../../assets/cross_icon.png';

Modal.setAppElement('#root');

const ListFlower = () => {
    const [allFlowers, setAllFlowers] = useState([]);
    const [editingFlower, setEditingFlower] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFlowerColors, setSelectedFlowerColors] = useState([]);

    const fetchFlowers = async () => {
        await fetch('http://localhost:4000/api/flowers/allflowers')
            .then((res) => res.json())
            .then((data) => { setAllFlowers(data); });
    }

    useEffect(() => {
        fetchFlowers();
    }, []);

    const removeFlower = async (id) => {
        await fetch('http://localhost:4000/api/flowers/removeflower', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        fetchFlowers();
    }

    const handleEdit = (flower) => {
        setEditingFlower(flower);
    }

    const handleSave = async (updatedFlower) => {
        await fetch('http://localhost:4000/api/flowers/updateflower', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFlower)
        });

        setEditingFlower(null);
        await fetchFlowers();
    }

    const openModal = (colors) => {
        setSelectedFlowerColors(colors);
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedFlowerColors([]);
    }

    return (
        <div className='list-flower'>
            <h1>Lista tuturor florilor</h1>
            <div className='listflower-format-main'>
                <p>Nume</p>
                <p>Culori</p>
                <p>Cantitate</p>
                <p>Acțiuni</p>
            </div>
            <div className="listflower-allflowers">
                <hr />
                {allFlowers.map((flower, index) => (
                    <React.Fragment key={index}>
                        <div className="listflower-format-main listflower-format">
                            <p>{flower.name}</p>
                            <div className="colors">
                                {flower.colors.slice(0, 3).join(', ')}
                                {flower.colors.length > 3 && '... '}
                                {flower.colors.length > 3 && <button className="view-more" onClick={() => openModal(flower.colors)}>Vezi mai mult</button>}
                            </div>
                            <p className="quantity">{flower.quantity}</p>
                            <div className="listflower-actions">
                                <button onClick={() => handleEdit(flower)}>Modifică</button>
                                <img onClick={() => { removeFlower(flower.id) }} className='listflower-remove-icon' src={cross_icon} alt="Remove" />
                            </div>
                        </div>
                        <hr />
                    </React.Fragment>
                ))}
            </div>

            {editingFlower && (
                <>
                    <div className="edit-flower-overlay" onClick={() => setEditingFlower(null)}></div>
                    <div className='edit-flower-form'>
                        <h2>Editează floare</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave(editingFlower);
                        }}>
                            <label>Nume:</label>
                            <input
                                type="text"
                                value={editingFlower.name}
                                onChange={(e) => setEditingFlower({ ...editingFlower, name: e.target.value })}
                            />
                            <label>Culori:</label>
                            <input
                                type="text"
                                value={editingFlower.colors.join(', ')}
                                onChange={(e) => setEditingFlower({ ...editingFlower, colors: e.target.value.split(',').map(c => c.trim()) })}
                            />
                            <label>Cantitate:</label>
                            <input
                                type="number"
                                value={editingFlower.quantity}
                                onChange={(e) => setEditingFlower({ ...editingFlower, quantity: parseInt(e.target.value) })}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit">Salvare</button>
                                <button type="button" onClick={() => setEditingFlower(null)}>Anulare</button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Flower Colors"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Culori floare</h2>
                <ul>
                    {selectedFlowerColors.map((color, index) => (
                        <li key={index}>{color}</li>
                    ))}
                </ul>
                <button onClick={closeModal}>închide</button>
            </Modal>
        </div>
    );
}

export default ListFlower;
