import React, { useState, useEffect } from 'react';
import './Filtering.css';
import dropdown_icon from '../../components/images/dropdown_icon.png';
import close_icon from '../../components/images/close-icon.png';

const Filtering = ({ filters, applyFilters }) => {
    const [category, setCategory] = useState(filters.category);
    const [priceRange, setPriceRange] = useState(filters.priceRange);
    const [selectedFlowers, setSelectedFlowers] = useState(filters.flowers);
    const [selectedColors, setSelectedColors] = useState(filters.colors);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [showPriceOptions, setShowPriceOptions] = useState(false);
    const [showFlowerOptions, setShowFlowerOptions] = useState(false);
    const [showColorOptions, setShowColorOptions] = useState(false);
    const [flowerOptions, setFlowerOptions] = useState([]);

    useEffect(() => {
        setCategory(filters.category);
        setPriceRange(filters.priceRange);
        setSelectedFlowers(filters.flowers);
        setSelectedColors(filters.colors);
    }, [filters]);

    useEffect(() => {
        fetch('http://localhost:4000/api/flowers/allflowers')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Flower Options:", data);
                setFlowerOptions(data);
            })
            .catch(error => console.error('Error fetching flower options:', error));
    }, []);

    const priceRanges = {
        '100-200': '100 - 200 ron',
        '200-300': '200 - 300 ron',
        '300-500': '300 - 500 ron'
    };

    const categories = {
        'buchete': 'Buchete',
        'cosuri-flori': 'Coșuri cu flori',
        'flori-criogenate': 'Flori criogenate',
        'flori-cutii': 'Flori în cutii'
    };

    const handleCategoryChange = (category) => {
        setCategory(category);
        setShowCategoryOptions(false);
        applyFilters({ ...filters, category });
    };

    const handlePriceRangeChange = (priceRange) => {
        setPriceRange(priceRange);
        setShowPriceOptions(false);
        applyFilters({ ...filters, priceRange });
    };

    const handleFlowerChange = (flower) => {
        const newSelectedFlowers = selectedFlowers.includes(flower)
            ? selectedFlowers.filter((selected) => selected !== flower)
            : [...selectedFlowers, flower];
        setSelectedFlowers(newSelectedFlowers);
        setShowFlowerOptions(false);
        applyFilters({ ...filters, flowers: newSelectedFlowers });
    };

    const handleColorChange = (color) => {
        const newSelectedColors = selectedColors.includes(color)
            ? selectedColors.filter((selected) => selected !== color)
            : [...selectedColors, color];
        setSelectedColors(newSelectedColors);
        setShowColorOptions(false);
        applyFilters({ ...filters, colors: newSelectedColors });
    };

    const handleRemoveFilter = (filterType, value) => {
        switch (filterType) {
            case 'category':
                setCategory('');
                applyFilters({ ...filters, category: '' });
                break;
            case 'priceRange':
                setPriceRange('');
                applyFilters({ ...filters, priceRange: '' });
                break;
            case 'flowers':
                const newFlowers = selectedFlowers.filter(flower => flower !== value);
                setSelectedFlowers(newFlowers);
                applyFilters({ ...filters, flowers: newFlowers });
                break;
            case 'colors':
                const newColors = selectedColors.filter(color => color !== value);
                setSelectedColors(newColors);
                applyFilters({ ...filters, colors: newColors });
                break;
            default:
                break;
        }
    };

    return (
        <div className="filtering-container">
            <form className="filtering-form">
                <div className="filtering-column">
                    <div className="filtering-item">
                        <div className="filtering-toggle" onClick={() => setShowCategoryOptions(!showCategoryOptions)}>
                            Tip produs
                            <img src={dropdown_icon} alt="" className={`filtering-toggle-icon ${showCategoryOptions ? 'expanded' : ''}`} />
                        </div>
                        {showCategoryOptions && (
                            <div className="options-box">
                                {Object.keys(categories).map((key) => (
                                    <button key={key} type="button" className="filtering-option" onClick={() => handleCategoryChange(key)}>{categories[key]}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    {category && (
                        <div className="filter-label">
                            {categories[category]}
                            <img src={close_icon} alt="Remove" className="remove-filter" onClick={() => handleRemoveFilter('category')} />
                        </div>
                    )}
                </div>

                <div className="filtering-column">
                    <div className="filtering-item">
                        <div className="filtering-toggle" onClick={() => setShowPriceOptions(!showPriceOptions)}>
                            Preț
                            <img src={dropdown_icon} alt="" className={`filtering-toggle-icon ${showPriceOptions ? 'expanded' : ''}`} />
                        </div>
                        {showPriceOptions && (
                            <div className="options-box">
                                {Object.keys(priceRanges).map((key) => (
                                    <button key={key} type="button" className="filtering-option" onClick={() => handlePriceRangeChange(key)}>{priceRanges[key]}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    {priceRange && (
                        <div className="filter-label">
                            {priceRanges[priceRange]}
                            <img src={close_icon} alt="Remove" className="remove-filter" onClick={() => handleRemoveFilter('priceRange')} />
                        </div>
                    )}
                </div>

                <div className="filtering-column">
                    <div className="filtering-item">
                        <div className="filtering-toggle" onClick={() => setShowFlowerOptions(!showFlowerOptions)}>
                            Flori
                            <img src={dropdown_icon} alt="" className={`filtering-toggle-icon ${showFlowerOptions ? 'expanded' : ''}`} />
                        </div>
                        {showFlowerOptions && (
                            <div className="options-box">
                                {flowerOptions.map((flower) => (
                                    <button key={flower.id} type="button" className="filtering-option" onClick={() => handleFlowerChange(flower.name)}>{flower.name}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedFlowers.length > 0 && (
                        <div className="filter-label">
                            {selectedFlowers.map(flower => (
                                <span key={flower}>
                                    {flower}
                                    <img src={close_icon} alt="Remove" className="remove-filter" onClick={() => handleRemoveFilter('flowers', flower)} />
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="filtering-column">
                    <div className="filtering-item">
                        <div className="filtering-toggle" onClick={() => setShowColorOptions(!showColorOptions)}>
                            Culori
                            <img src={dropdown_icon} alt="" className={`filtering-toggle-icon ${showColorOptions ? 'expanded' : ''}`} />
                        </div>
                        {showColorOptions && (
                            <div className="options-box">
                                {['Roz', 'Alb', 'Roșu', 'Mov', 'Portocaliu', 'Crem', 'Albastru', 'Multicolore'].map((color) => (
                                    <button key={color} type="button" className="filtering-option" onClick={() => handleColorChange(color)}>{color}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedColors.length > 0 && (
                        <div className="filter-label">
                            {selectedColors.map(color => (
                                <span key={color}>
                                    {color}
                                    <img src={close_icon} alt="Remove" className="remove-filter" onClick={() => handleRemoveFilter('colors', color)} />
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Filtering;
