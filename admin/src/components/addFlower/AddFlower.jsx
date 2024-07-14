import React, { useState } from 'react';
import Select from 'react-select';
import './AddFlower.css';

const AddFlower = () => {
    const [flowerData, setFlowerData] = useState({
        name: '',
        colors: [],
        quantity: 0
    });

    const colorOptions = [
        { value: 'Roz', label: 'Roz' },
        { value: 'Alb', label: 'Alb' },
        { value: 'Roșu', label: 'Roșu' },
        { value: 'Mov', label: 'Mov' },
        { value: 'Portocaliu', label: 'Portocaliu' },
        { value: 'Galben', label: 'Galben' },
        { value: 'Crem', label: 'Crem' },
        { value: 'Albastru', label: 'Albastru' },
        { value: 'Multicolore', label: 'Multicolore' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlowerData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleColorsChange = (selectedOptions) => {
        setFlowerData(prevData => ({
            ...prevData,
            colors: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, colors, quantity } = flowerData;
        const newFlower = { name, colors, quantity: parseInt(quantity, 10) };

        try {
            const response = await fetch('http://localhost:4000/api/flowers/addflower', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFlower)
            });
            const result = await response.json();
            if (result.success) {
                alert(`Flower added successfully with ID: ${result.id}`);
            } else {
                alert(`Failed to add flower: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding flower:', error);
            alert('Error adding flower');
        }
    };

    return (
        <div className='addflower'>
            <h1>Adaugă floare</h1>
            <form onSubmit={handleSubmit} className='addflower-form'>
                <div className='addflower-field'>
                    <label htmlFor='name'>Nume floare</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={flowerData.name}
                        onChange={handleChange}
                        required
                        placeholder='Enter flower name'
                    />
                </div>
                <div className='addflower-field'>
                    <label htmlFor='colors'>Culori floare</label>
                    <Select
                        isMulti
                        name='colors'
                        options={colorOptions}
                        className='basic-multi-select'
                        classNamePrefix='select'
                        onChange={handleColorsChange}
                        placeholder='Select colors'
                    />
                </div>
                <div className='addflower-field'>
                    <label htmlFor='quantity'>Cantitate</label>
                    <input
                        type='number'
                        id='quantity'
                        name='quantity'
                        value={flowerData.quantity}
                        onChange={handleChange}
                        min='0'
                        required
                        placeholder='Enter quantity'
                    />
                </div>
                <button type='submit' className='addflower-btn'>Adaugă floare</button>
            </form>
        </div>
    );
};

export default AddFlower;