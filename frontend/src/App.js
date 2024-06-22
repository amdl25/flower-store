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
import OrderSuccess from './pages/orderSuccess/OrderSuccess';
import PaymentMock from './pages/paymentMock/PaymentMock';
import PromoDisplay from './components/promoDisplay/PromoDisplay';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const [promoCodes, setPromoCodes] = useState([]);
  const [showPromoDisplay, setShowPromoDisplay] = useState(false);
  const [isPromoMinimized, setIsPromoMinimized] = useState(false);

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

  const handleTogglePromoDisplay = () => {
    setIsPromoMinimized(!isPromoMinimized);
  };

  const removeDuplicatePromoCodes = (promoCodes) => {
    const uniquePromoCodes = [];
    const seenIds = new Set();

    for (const promoCode of promoCodes) {
      if (!seenIds.has(promoCode._id)) {
        uniquePromoCodes.push(promoCode);
        seenIds.add(promoCode._id);
      }
    }

    return uniquePromoCodes;
  };
  

  useEffect(() => {
    console.log('useEffect executed in App.js');
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

          fetch('http://localhost:4000/api/orders/userorders', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(orderData => {
            if (orderData.success) {
              const orders = orderData.orders;
              const orderCount = orders.length;

              const today = new Date();
              const joinDate = new Date(data.user.date);
              const daysSinceJoined = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));

              let allPromoCodes = [];

              if (daysSinceJoined <= 7) {
                console.log('User is new, checking for promo codes...');
                fetch('http://localhost:4000/api/promocodes/criteria/user_nou')
                  .then(res => res.json())
                  .then(promoCodes => {
                    console.log('Promo codes for new user fetched:', promoCodes);
                    if (promoCodes.length > 0) {
                      allPromoCodes = [...allPromoCodes, ...promoCodes];
                    }
                  })
                  .catch(error => console.error('Error fetching promo codes for new user:', error));
              }

              if (orderCount >= 2) {
                console.log('User is a loyal customer, checking for promo codes...');
                fetch('http://localhost:4000/api/promocodes/criteria/client_fidel')
                  .then(res => res.json())
                  .then(promoCodes => {
                    console.log('Promo codes for loyal customers fetched:', promoCodes);
                    if (promoCodes.length > 0) {
                      allPromoCodes = [...allPromoCodes, ...promoCodes];
                    }
                  })
                  .catch(error => console.error('Error fetching promo codes for loyal customers:', error));
              }

              fetch('http://localhost:4000/api/promocodes/allpromocodes')
              .then(res => res.json())
              .then(generalPromoCodes => {
                console.log('General promo codes response:', generalPromoCodes);
                if (Array.isArray(generalPromoCodes) && generalPromoCodes.length > 0) {
                  console.log('General promo codes fetched:', generalPromoCodes);
                  allPromoCodes = [...allPromoCodes, ...generalPromoCodes];
                } else {
                  console.warn('No valid promo codes found in the general response or the response is not an array:', generalPromoCodes);
                }

              const uniquePromoCodes = removeDuplicatePromoCodes(allPromoCodes);
              console.log('Unique promo codes after deduplication:', uniquePromoCodes);

              setPromoCodes(uniquePromoCodes);
                setShowPromoDisplay(allPromoCodes.length > 0);
              })
              .catch(error => console.error('Error fetching general promo codes:', error));

            } else {
              console.error('Failed to fetch orders:', orderData.message);
            }
          })
          .catch(error => console.error('Error fetching orders:', error));
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment" element={<PaymentMock />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      {showPromoDisplay && promoCodes.length > 0 && (
        <PromoDisplay
          promoCodes={promoCodes}
          isMinimized={isPromoMinimized}
          onToggle={handleTogglePromoDisplay}
        />
      )}
    </div>
  );
}

export default App;