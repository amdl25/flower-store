import React, { useContext, useState, useRef, useEffect } from 'react';
import './Navbar.css';
import cart_icon from '../images/cart-icon.png';
import profile from '../images/profile-icon.png';
import search from '../images/search-icon.png';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import nav_dropdown from '../images/nav_dropdown.png';

const Navbar = ({ isAuthenticated }) => {
    const [menu, setMenu] = useState("acasa");
    const { getTotalCartItems } = useContext(ShopContext);

    const [activeCategory, setActiveCategory] = useState(null);
    const [occasions, setOccasions] = useState([]);

    const menuRef = useRef();

    const handleMouseEnter = (category) => {
        setActiveCategory(category);
    };

    const handleMouseLeave = () => {
        setActiveCategory(null);
    };

    const [query, setQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearchInput = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearchEnter = (event) => {
        if (event.key === 'Enter') {
            navigate(`/search?q=${query}`);
        }
    };

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    useEffect(() => {
        const fetchOccasions = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/occasions/alloccasions');
                const data = await response.json();
                setOccasions(data);
            } catch (error) {
                console.error('Error fetching occasions:', error);
            }
        };

        fetchOccasions();
    }, []);

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF-]/g, '')
            .replace(/-+/g, '-');
    };

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <p>Eden</p>
                <img src={logo} alt="" className="logo-icon" />
            </div>
            <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={() => { setMenu("acasa") }}><Link style={{ textDecoration: "none", color: 'black' }} to="/">Acasă</Link>{menu === "acasa" ? <hr /> : <> </>}</li>
                <li onClick={() => { setMenu("produse") }}
                    className="dropdown"
                    onMouseEnter={() => handleMouseEnter("produse")}
                    onMouseLeave={handleMouseLeave}>
                    <Link to="/produse" style={{ textDecoration: "none", color: 'black' }}>Produse</Link>{menu === "produse" ? <hr /> : <> </>}
                    {activeCategory === "produse" && (
                        <div className="dropdown-content">
                            <Link to="/produse/buchete">Buchete</Link>
                            <Link to="/produse/cosuri-flori">Coșuri cu flori</Link>
                            <Link to="/produse/flori-criogenate">Flori criogenate</Link>
                            <Link to="/produse/flori-cutii">Flori în cutii</Link>
                        </div>
                    )}
                </li>
                <li onClick={() => { setMenu("ocazii") }}
                    className="dropdown"
                    onMouseEnter={() => handleMouseEnter("ocazii")}
                    onMouseLeave={handleMouseLeave}>
                    <Link to="/ocazii" style={{ textDecoration: "none", color: 'black' }}>Ocazii</Link>{menu === "ocazii" ? <hr /> : <> </>}
                    {activeCategory === "ocazii" && (
                        <div className="dropdown-content">
                            {occasions.map(occasion => (
                                <Link key={occasion.id} to={`/ocazii/${slugify(occasion.name)}`}>{occasion.name}</Link>
                            ))}
                        </div>
                    )}
                </li>
                <li onClick={() => { setMenu("despre noi") }}><Link style={{ textDecoration: "none", color: 'black' }} to="/despre noi">Despre noi</Link>{menu === "despre noi" ? <hr /> : <> </>}</li>
            </ul>
            <div className='nav-search-cart-profile'>
                <img src={search} alt="" className="search-icon" onClick={handleSearchInput} />
                {isSearchOpen && (
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyPress={handleSearchEnter}
                        placeholder="Ce îți dorești astăzi..."
                        className="search-input"
                    />
                )}
                <Link to="/cart"><img src={cart_icon} alt="" className="cart-icon" /></Link>
                <div className='nav-cart-no-products'>{getTotalCartItems()}</div>
                {isAuthenticated ? (
                    <Link to="/profil">
                        <img src={profile} alt="Profile" className="profile-icon" />
                    </Link>
                ) : (
                    <Link to="/login">
                        <img src={profile} alt="Login/Sign Up" className="profile-icon" />
                    </Link>
                )}
            </div>

        </div>
    )
}

export default Navbar;
