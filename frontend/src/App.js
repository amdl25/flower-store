import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Acasa from './pages/Acasa';
import CategorieMeniu from './pages/categorieMeniu/CategorieMeniu';
import Profil from './pages/profil/Profil';
import Produs from './pages/Produs';
import Cart from './pages/Cart';
import Footer from './components/footer/Footer';
import Search from './pages/search/Search';
import DespreNoi from './pages/despreNoi/DespreNoi';
import LoginSignup from './pages/loginSignup/LoginSignup';
import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/orderSuccess/OrderSuccess'
import PaymentMock from './pages/paymentMock/PaymentMock';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUserData(userData);
  };

  const handleSignup = (userData) => {
    setIsAuthenticated(true);
    setUserData(userData);
  };

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      fetch('http://localhost:4000/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsAuthenticated(true);
          setUserData(data.user);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path='/' element={<Acasa />} />
          <Route path='/produse' element={<CategorieMeniu categorie="produse" />} />
          <Route path='/produse/:subcategorie' element={<CategorieMeniu />} />
          <Route path='/ocazii' element={<CategorieMeniu categorie="ocazii" />} />
          <Route path='/ocazii/:subcategorie' element={<CategorieMeniu />} />
          <Route path='/despre noi' element={<DespreNoi />} />
          <Route path='/produs' element={<Produs />}>
            <Route path=':idProdus' element={<Produs />} />
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path="/login" element={<LoginSignup onLogin={handleLogin} onSignup={handleSignup} isAuthenticated={isAuthenticated} />} />
          <Route path="/profil" element={isAuthenticated ? <Profil userData={userData} setIsAuthenticated={setIsAuthenticated} updateUserData={updateUserData} /> : <Navigate to="/login" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/checkout" element = {<Checkout/>}/>
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment" element={<PaymentMock />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
