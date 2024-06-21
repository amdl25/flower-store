import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';
import upload_area from '../../assets/upload_area.svg';

const ListProduct = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [image, setImage] = useState(null);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/api/products/allproducts')
            .then((res) => res.json())
            .then((data) => { setAllProducts(data) });
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    const removeProduct = async (id) => {
        await fetch('http://localhost:4000/api/products/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });
        await fetchInfo();
    }

    const handleEdit = (product) => {
        setEditingProduct(product);
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    }

    const handleSave = async (updatedProduct) => {
        let imageUrl = updatedProduct.image;

        if (image) {
            let formData = new FormData();
            formData.append('product', image);

            await fetch('http://localhost:4000/upload', {
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

        updatedProduct.image = imageUrl;

        await fetch('http://localhost:4000/api/products/updateproduct', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        setEditingProduct(null);
        setImage(null);
        await fetchInfo();
    }

    return (
        <div className='list-product'>
            <h1>Listă produse</h1>
            <div className='listproduct-format-main'>
                <p>Produs</p>
                <p>Nume</p>
                <p>Preț</p>
                <p>Preț Redus</p>
                <p>Categorie</p>
                <p>Acțiuni</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allProducts.map((product, index) => (
                    <React.Fragment key={index}>
                        <div className="listproduct-format-main listproduct-format">
                            <img src={product.image} alt="" className="listproduct-product-icon" />
                            <p>{product.name}</p>
                            <p>{product.price} lei</p>
                            <p>{product.discountedPrice || 0} lei</p>
                            <p>{product.category}</p>
                            <div className="listproduct-actions">
                                <button onClick={() => handleEdit(product)}>Modifică</button>
                                <img onClick={() => { removeProduct(product.id) }} className='listproduct-remove-icon' src={cross_icon} alt="" />
                            </div>
                        </div>
                        <hr />
                    </React.Fragment>
                ))}
            </div>

            {editingProduct && (
                <>
                    <div className="edit-product-overlay" onClick={() => setEditingProduct(null)}></div>
                    <div className='edit-product-form'>
                        <h2>Editează produs</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave(editingProduct);
                        }}>
                            <label>Nume:</label>
                            <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            />
                            <label>Preț:</label>
                            <input
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                            />
                            <label>Preț redus:</label>
                            <input
                                type="number"
                                value={editingProduct.discount || ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, discount: parseFloat(e.target.value) || 0 })}
                            />
                            <label>Categorie:</label>
                            <input
                                type="text"
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            />
                            <label>Imagine:</label>
                            <div className='upload-field'>
                                <label htmlFor="file-input">
                                    <img src={image ? URL.createObjectURL(image) : editingProduct.image} alt="Upload area" className='edit-product-thumbnail-img'/>
                                </label>
                                <input onChange={handleImageChange} type='file' name='image' id='file-input' hidden />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit">Salvare</button>
                                <button type="button" onClick={() => setEditingProduct(null)}>Anulare</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default ListProduct;
