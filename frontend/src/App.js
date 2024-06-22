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
  const [applicablePromoCodes, setApplicablePromoCodes] = useState([]);
  const [isPromoMinimized, setIsPromoMinimized] = useState(false);

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUserData(userData);
    localStorage.setItem('auth-token', token);
  };

  const handleSignup = (userData, token) => {
    setIsAuthenticated(true);
    setUserData(userData);
    localStorage.setItem('auth-token', token);
  };

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  const handleTogglePromoDisplay = () => {
    setIsPromoMinimized(!isPromoMinimized);
  };

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:4000/api/user/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success) {
            setIsAuthenticated(true);
            setUserData(data.user);

            const fetchPromoCodes = async () => {
              let fetchedPromoCodes = [];

              try {
                const generalResponse = await fetch('http://localhost:4000/api/promocodes/allpromocodes');
                const generalData = await generalResponse.json();
                if (generalData.success) {
                  fetchedPromoCodes = generalData.promoCodes;
                }
              } catch (error) {
                console.error('Error fetching general promo codes:', error);
              }

              const ordersResponse = await fetch('http://localhost:4000/api/orders/userorders', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });
              const ordersData = await ordersResponse.json();
              if (ordersData.success) {
                const orders = ordersData.orders;
                const orderCount = orders.length;

                const today = new Date();
                const joinDate = new Date(data.user.date);
                const daysSinceJoined = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));

                if (daysSinceJoined <= 7) {
                  try {
                    const newUserPromoResponse = await fetch('http://localhost:4000/api/promocodes/criteria/user_nou');
                    const newUserPromoData = await newUserPromoResponse.json();
                    if (newUserPromoData.length > 0) {
                      fetchedPromoCodes = [...fetchedPromoCodes, ...newUserPromoData];
                    }
                  } catch (error) {
                    console.error('Error fetching new user promo codes:', error);
                  }
                }

                if (orderCount >= 2) {
                  try {
                    const loyalCustomerPromoResponse = await fetch('http://localhost:4000/api/promocodes/criteria/client_fidel');
                    const loyalCustomerPromoData = await loyalCustomerPromoResponse.json();
                    if (loyalCustomerPromoData.length > 0) {
                      fetchedPromoCodes = [...fetchedPromoCodes, ...loyalCustomerPromoData];
                    }
                  } catch (error) {
                    console.error('Error fetching loyal customer promo codes:', error);
                  }
                }
              }

              if (fetchedPromoCodes.length > 0) {
                setApplicablePromoCodes(fetchedPromoCodes);
                console.log('Fetched Promo Codes:', fetchedPromoCodes);
              } else {
                setApplicablePromoCodes([]);
              }
            };

            fetchPromoCodes();
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('auth-token');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('auth-token');
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated]);

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
      {applicablePromoCodes.length > 0 && (
        <PromoDisplay
          promoCodes={applicablePromoCodes}
          isMinimized={isPromoMinimized}
          onToggle={handleTogglePromoDisplay}
        />
      )}
    </div>
  );
}

export default App;
