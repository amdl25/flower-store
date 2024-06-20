import React, { useState } from 'react';
import './AddMonthlyFlowerSubscription.css';
import upload_area from '../../assets/upload_area.svg';

const AddMonthlyFlowerSubscription = () => {
    const [flowerDetails, setFlowerDetails] = useState({
        month: "",
        flowerName: "",
        description: "",
        flowerImage: null
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlowerDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFlowerDetails(prevDetails => ({
            ...prevDetails,
            flowerImage: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('month', flowerDetails.month);
        formData.append('flowerName', flowerDetails.flowerName);
        formData.append('description', flowerDetails.description);
        if (flowerDetails.flowerImage) {
            formData.append('flowerImage', flowerDetails.flowerImage);
        }

        try {
            const imageUploadResponse = await fetch('http://localhost:4000/upload/monthlyflower', {
                method: 'POST',
                body: formData
            });

            const imageData = await imageUploadResponse.json();

            if (imageData.success) {
                const flowerDetailsResponse = await fetch('http://localhost:4000/api/monthlyflowersubscriptions/addmonthlyflowersubscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        month: flowerDetails.month,
                        flowerName: flowerDetails.flowerName,
                        description: flowerDetails.description,
                        flowerImage: imageData.image_url
                    })
                });

                const response = await flowerDetailsResponse.json();
                if (response.success) {
                    setMessage('Monthly flower added successfully!');
                    setFlowerDetails({
                        month: "",
                        flowerName: "",
                        description: "",
                        flowerImage: null
                    });
                } else {
                    setMessage('Failed to add monthly flower: ' + response.message);
                }
            } else {
                setMessage('Failed to upload image: ' + imageData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while adding the monthly flower.');
        }
    };

    return (
        <div className="add-monthly-flower">
            <h1>Adaugă Floarea Lunii</h1>
            <div className='form-group'>
                <label>Luna</label>
                <input value={flowerDetails.month} onChange={handleChange} type='text' name='month' placeholder='Type here' />
            </div>
            <div className='form-group'>
                <label>Nume floare</label>
                <input value={flowerDetails.flowerName} onChange={handleChange} type='text' name='flowerName' placeholder='Type here' />
            </div>
            <div className='form-group'>
                <label>Descriere</label>
                <textarea value={flowerDetails.description} onChange={handleChange} name='description' placeholder='Type here'></textarea>
            </div>
            <div className='upload-field'>
                <label htmlFor="file-input">
                    <img src={flowerDetails.flowerImage ? URL.createObjectURL(flowerDetails.flowerImage) : upload_area} alt="Upload area" className='upload-thumbnail-img'/>
                </label>
                <input onChange={handleImageChange} type='file' name='flowerImage' id='file-input' hidden/>
            </div>
            <button onClick={handleSubmit} className='addproduct-btn'>Adaugă floare</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddMonthlyFlowerSubscription;
