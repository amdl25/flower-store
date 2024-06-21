import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ListMonthlyFlowerSubscription.css';
import cross_icon from '../../assets/cross_icon.png';

const ListMonthlyFlowerSubscription = () => {
    const [allMonthlyFlowers, setAllMonthlyFlowers] = useState([]);
    const [editingFlower, setEditingFlower] = useState(null);
    const [image, setImage] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/api/monthlyflowersubscriptions/allmonthlyflowersubscriptions')
            .then((res) => res.json())
            .then((data) => { setAllMonthlyFlowers(data.flowers) });
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    const removeMonthlyFlower = async (id) => {
        await fetch(`http://localhost:4000/api/monthlyflowersubscriptions/removemonthlyflowersubscription'`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });
        await fetchInfo();
    }

    const handleEdit = (flower) => {
        setEditingFlower(flower);
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    }

    const handleSave = async (updatedFlower) => {
        let imageUrl = updatedFlower.flowerImage;

        if (image) {
            let formData = new FormData();
            formData.append('flowerImage', image);

            await fetch('http://localhost:4000/upload/monthlyflower', {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.success) {
                    imageUrl = data.image_url;
                } else {
                    alert('Image upload failed');
                    return;
                }
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                alert('Error uploading image');
                return;
            });
        }

        updatedFlower.flowerImage = imageUrl;

        await fetch(`http://localhost:4000/api/monthlyflowersubscriptions/updatemonthlyflowersubscription`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFlower)
        });

        setEditingFlower(null);
        setImage(null);
        await fetchInfo();
    }

    const openModal = (description) => {
        setSelectedDescription(description);
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    return (
        <div className='list-monthly-flower'>
            <h1>Lista florilor lunii</h1>
            <div className='list-format-main'>
                <p>Imagine</p>
                <p>Lună</p>
                <p>Nume floare</p>
                <p>Descriere</p>
                <p>Acțiuni</p>
            </div>
            <div className="list-allflowers">
                <hr />
                {allMonthlyFlowers.map((flower, index) => (
                    <React.Fragment key={index}>
                        <div className="list-format-main list-format">
                            <img src={flower.flowerImage} alt={flower.flowerName} className="list-flower-icon" />
                            <p>{flower.month}</p>
                            <p>{flower.flowerName}</p>
                            <p>
                                {flower.description.length > 30 ? 
                                    <>
                                        {flower.description.substring(0, 30)}...
                                        <button className="view-more" onClick={() => openModal(flower.description)}>Vezi mai mult</button>
                                    </> 
                                    : flower.description}
                            </p>
                            <div className="list-actions">
                                <button onClick={() => handleEdit(flower)}>Modifică</button>
                                <img onClick={() => { removeMonthlyFlower(flower.id) }} className='list-remove-icon' src={cross_icon} alt="Delete" />
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
                        <h2>Editează floarea lunii</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave(editingFlower);
                        }}>
                            <label>Lună:</label>
                            <input
                                type="text"
                                value={editingFlower.month}
                                onChange={(e) => setEditingFlower({ ...editingFlower, month: e.target.value })}
                            />
                            <label>Nume floare:</label>
                            <input
                                type="text"
                                value={editingFlower.flowerName}
                                onChange={(e) => setEditingFlower({ ...editingFlower, flowerName: e.target.value })}
                            />
                            <label>Descriere:</label>
                            <textarea
                                value={editingFlower.description}
                                onChange={(e) => setEditingFlower({ ...editingFlower, description: e.target.value })}
                            />
                            <label>Imagine:</label>
                            <div className='upload-field'>
                                <label htmlFor="file-input">
                                    <img src={image ? URL.createObjectURL(image) : editingFlower.flowerImage} alt="Upload area" className='edit-flower-thumbnail-img'/>
                                </label>
                                <input onChange={handleImageChange} type='file' name='flowerImage' id='file-input' hidden />
                            </div>
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
                contentLabel="Flower Description"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Descriere floarea lunii</h2>
                <p>{selectedDescription}</p>
                <button onClick={closeModal}>Închide</button>
            </Modal>
        </div>
    );
}

export default ListMonthlyFlowerSubscription;
