import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Profil.css';
import { ShopContext } from '../../context/ShopContext';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
};



const Profil = ({ userData, setIsAuthenticated, updateUserData }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(userData);
    const [newPassword, setNewPassword] = useState('');
    const [orders, setOrders] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState('');
    const navigate = useNavigate();
    const { logout, all_product } = useContext(ShopContext);

    useEffect(() => {
        setFormData(userData);
        fetchUserOrders();
    }, [userData]);

    const fetchUserOrders = async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            setOrders([]);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/orders/userorders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            } else {
                console.error('Failed to fetch orders:', data.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        setIsAuthenticated(false);
        logout();
        navigate('/');
    };

    const handleEditProfile = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setFormData(userData);
    };

    const handleSaveProfile = async () => {
        const token = localStorage.getItem('auth-token');
        const updatedData = {
            name: formData.name,
            email: formData.email,
            address: formData.address
        };

        if (newPassword) {
            updatedData.password = newPassword;
        }

        try {
            const response = await fetch('http://localhost:4000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();
            if (data.success) {
                setIsEditMode(false);
                updateUserData(data.user);
            } else {
                alert(data.error || 'Failed to update the profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile. Please try again.');
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Ești sigur că vrei să ștergi profilul tău?')) {
            const token = localStorage.getItem('auth-token');
            try {
                const response = await fetch('http://localhost:4000/api/user/profile', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (data.success) {
                    localStorage.removeItem('auth-token');
                    setIsAuthenticated(false);
                    navigate('/');
                } else {
                    alert(data.error || 'Failed to delete the profile.');
                }
            } catch (error) {
                console.error('Error deleting profile:', error);
                alert('An error occurred while deleting the profile. Please try again.');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openModal = (message) => {
        setSelectedMessage(message);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="profile">
            <h2>Profilul utilizatorului</h2>
            {isEditMode ? (
                <div className="profile-edit">
                    <div className="profile-fields">
                        <label>
                            <strong>Nume:</strong>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                placeholder="Nume"
                            />
                        </label>
                        <label>
                            <strong>Email:</strong>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="Email"
                            />
                        </label>
                        <label>
                            <strong>Adresă:</strong>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                type="text"
                                placeholder="Adresă"
                            />
                        </label>
                        <label>
                            <strong>Parolă:</strong>
                            <input
                                name="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                placeholder="Introduceți o nouă parolă"
                            />
                        </label>
                    </div>
                    <div className="profile-actions">
                        <button onClick={handleSaveProfile}>Salvează</button>
                        <button onClick={handleCancelEdit}>Anulează</button>
                    </div>
                </div>
            ) : (
                <div className="profile-info">
                    <p><strong>Nume:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Adresă:</strong> {userData.address}</p>
                    <p>
                        <strong>Parolă:</strong>
                        {'*'.repeat(8)}
                    </p>
                </div>
            )}
            <div className="profile-actions">
                {!isEditMode && <button onClick={handleEditProfile}>Editează profilul</button>}
                <button onClick={handleLogout}>Deconectare</button>
                <button onClick={handleDeleteProfile}>Șterge profilul</button>
            </div>

            <div className="user-orders">
                <h3>Comenzile tale</h3>
                {orders.length > 0 ? (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div className="order-card" key={order.id}>
                                <p><strong>Data:</strong> {formatDate(order.date)}</p>
                                <p><strong>Total:</strong> {order.totalAmount} lei</p>
                                <p><strong>Produse:</strong></p>
                                <div className="order-products">
                                    {order.products.map(product => {
                                        const productDetails = all_product.find(p => p.id === product.productId);
                                        return (
                                            <div className="product-item" key={product.productId}>
                                                <img src={productDetails?.image} alt={productDetails?.name} className="product-image" />
                                                <div className="product-info">
                                                    <p><strong>Nume:</strong> {productDetails?.name}</p>
                                                    <p><strong>Cantitate:</strong> {product.quantity}</p>
                                                    <p><strong>Data Livrării:</strong> {formatDate(product.date)}</p>
                                                    <p><strong>Ora Livrării:</strong> {product.time}</p>
                                                </div>
                                                {product.selectedOptions && (
                                                    <div className="selected-options">
                                                        {product.selectedOptions.greetingCard && (
                                                            <p><strong>Felicitare Inclusă</strong></p>
                                                        )}
                                                        {product.selectedOptions.chocolateBox && (
                                                            <p><strong>Cutie de Ciocolată Inclusă</strong></p>
                                                        )}
                                                    </div>
                                                )}
                                                {product.greetingMessage && (
                                                    <div className="greeting-message">
                                                        <strong>Mesaj Felicitare:</strong> 
                                                        {product.greetingMessage.length > 20 ? (
                                                            <>
                                                                {product.greetingMessage.substring(0, 20)}...
                                                                <button className="view-more" onClick={() => openModal(product.greetingMessage)}>Vezi mai mult</button>
                                                            </>
                                                        ) : (
                                                            <span>{product.greetingMessage}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nu ai nicio comandă.</p>
                )}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Mesaj Felicitare"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Mesaj Felicitare</h2>
                <p>{selectedMessage}</p>
                <button onClick={closeModal}>Înapoi</button>
            </Modal>
        </div>
    );
};

export default Profil;
