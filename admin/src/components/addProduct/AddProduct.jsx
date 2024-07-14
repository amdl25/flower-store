import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "buchete",
        price: "",
        discountedPrice: "",
        flowers: [],
        occasions: [],
        isSurprise: false
    });
    const [flowersOptions, setFlowersOptions] = useState([]);
    const [occasionsOptions, setOccasionsOptions] = useState([]);
    const [flowerColors, setFlowerColors] = useState({});

    const imageHandler = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };
    

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setProductDetails(prevDetails => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value
        }));

    };


    const handleFlowersChange = async (selectedOptions) => {
        const selectedFlowers = selectedOptions.map(option => ({
            id: option.value,
            flower: option.value,
            name: option.label,
            quantity: 0
        }));
        setProductDetails(prevDetails => ({
            ...prevDetails,
            flowers: selectedFlowers
        }));
    
        const colorsPromises = selectedFlowers.map(flower => {
            return fetch(`http://localhost:4000/api/flowers/flowerColors/${flower.id}`)
                .then(response => response.json());
        });
        const colors = await Promise.all(colorsPromises);
        const colorsObj = {};
        selectedFlowers.forEach((flower, index) => {
            colorsObj[flower.id] = colors[index];
        });
        setFlowerColors(colorsObj);
    };
    

    const handleFlowerQuantityChange = (flowerId, quantity) => {
        const updatedFlowers = productDetails.flowers.map(flower => {
            if (flower.id === flowerId) {
                return { ...flower, quantity };
            }
            return flower;
        });
        setProductDetails(prevDetails => ({
            ...prevDetails,
            flowers: updatedFlowers
        }));
    };

    const handleFlowerColorChange = (flowerId, selectedOptions) => {
        const selectedColors = selectedOptions.map(option => option.value);
        const updatedFlowers = productDetails.flowers.map(flower => {
            if (flower.id === flowerId) {
                return { ...flower, selectedColors };
            }
            return flower;
        });
        setProductDetails(prevDetails => ({
            ...prevDetails,
            flowers: updatedFlowers
        }));
    };
    
    

    const handleOccasionsChange = (selectedOptions) => {
        setProductDetails(prevDetails => ({
            ...prevDetails,
            occasions: selectedOptions.map(option => option.value)
        }));
    };

    const fetchFlowers = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/flowers/allflowers');
            const data = await response.json();
            setFlowersOptions(data.map(flower => ({ value: flower.id, label: flower.name })));
        } catch (error) {
            console.error('Error fetching flowers:', error);
        }
    };

    const fetchOccasions = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/occasions/alloccasions');
            const data = await response.json();
            setOccasionsOptions(data.map(occasion => ({ value: occasion.id, label: occasion.name })));
        } catch (error) {
            console.error('Error fetching occasions:', error);
        }
    };

    const addProduct = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;
    
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
            responseData = data;
            if (!responseData.success) {
                console.error('Image upload failed:', responseData);
                alert('Image upload failed');
                return;
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        });
    
        if (responseData && responseData.success) {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/api/products/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.success) {
                    alert('Product added');
                } else {
                    console.error('Failed to add product:', data);
                    alert(`Failed to add product: ${data.error}`);
                }
            })
            .catch(error => {
                console.error('Error adding product:', error);
                alert('Error adding product');
            });
        }
    };
    

    useEffect(() => {
        fetchFlowers();
        fetchOccasions();
    }, []);

    return (
        <div className='addproduct'>
            <div className='addproduct-itemfield'>
                <p>Nume produs</p>
                <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type here' />
            </div>
            <div className='addproduct-price'>
                <div className='addproduct-itemfield'>
                    <p>Preț</p>
                    <input value={productDetails.price} onChange={changeHandler} type='text' name='price' placeholder='Type here' />
                </div>
                <div className='addproduct-itemfield'>
                    <p>Preț Redus</p>
                    <input value={productDetails.discountedPrice} onChange={changeHandler} type='text' name='discountedPrice' placeholder='Type here' />
                </div>
            </div>
            <div className='addproduct-itemfield'>
                <p>Categorie produs</p>
                <select value={productDetails.category} onChange={changeHandler} name='category' className='add-product-selector'>
                    <option value='buchete'>Buchete</option>
                    <option value='cosuri-flori'>Coșuri cu flori</option>
                    <option value='flori-cutii'>Flori în cutii</option>
                    <option value='flori-criogenate'>Flori criogenate</option>
                </select>
            </div>
            <div className='addproduct-itemfield upload-field'>
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} alt="Upload area" className='addproduct-thumbnail-img'/>
                </label>
                <input onChange={imageHandler} type='file' name='image' id='file-input' hidden/>
            </div>
            <div className='addproduct-itemfield'>
                <p>Alege florile</p>
                <Select
                    isMulti
                    name="flowers"
                    options={flowersOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleFlowersChange}
                />

                

                {productDetails.flowers.map(flower => (
                <div key={flower.id} className='addproduct-itemfield'>
                    <p>Alege culoarea pentru {flower.name}</p>
                        <Select
                            isMulti
                            options={flowerColors[flower.id] || []}
                            onChange={(selectedOptions) => handleFlowerColorChange(flower.id, selectedOptions)}
                        />
                    {productDetails.category !== 'flori-criogenate' && (
                            <>
                                <p>Cantitate pentru {flower.name}</p>
                                <input 
                                    type="number" 
                                    value={flower.quantity} 
                                    onChange={(e) => handleFlowerQuantityChange(flower.id, Math.max(0, e.target.value))} 
                                />
                            </>
                        )}
                </div>
                ))}
            </div>
            <div className='addproduct-itemfield'>
                <p>Alege ocazii</p>
                <Select
                    isMulti
                    name="occasions"
                    options={occasionsOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleOccasionsChange}
                />
            </div>
            <div className='addproduct-checkbox-container'>
                <input type='checkbox' name='isSurprise' className='addproduct-checkbox' checked={productDetails.isSurprise} onChange={changeHandler} />
                <label className='addproduct-checkbox-label'>Produs surpriză</label>
            </div>
            <button onClick={()=> addProduct()} className='addproduct-btn'>Adaugă produs</button>
        </div>
    );
};

export default AddProduct;
