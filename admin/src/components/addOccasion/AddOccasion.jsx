import React, { useState } from 'react';
import './AddOccasion.css';

const AddOccasion = () => {
    const [occasionData, setOccasionData] = useState({
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOccasionData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newOccasion = { name: occasionData.name };

        try {
            const response = await fetch('http://localhost:4000/api/occasions/addoccasion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOccasion) 
            });
            const result = await response.json();
            if (result.success) {
                alert(`Occasion added successfully with ID: ${result.id}`);
                setOccasionData({ name: '' });
            } else {
                alert(`Failed to add occasion: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding occasion:', error);
            alert('Error adding occasion');
        }
    };

    return (
        <div className='addoccasion'>
            <h1>Adaugă ocazie</h1>
            <form onSubmit={handleSubmit} className='addoccasion-form'>
                <div className='addoccasion-field'>
                    <label htmlFor='name'>Nume ocazie</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={occasionData.name}
                        onChange={handleChange}
                        required
                        placeholder='Enter occasion name'
                    />
                </div>
                <button type='submit' className='addoccasion-btn'>Adaugă ocazie</button>
            </form>
        </div>
    );
}

export default AddOccasion;
