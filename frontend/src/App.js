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

  const checkEligibility = async (promoCode, user, orders) => {
    if (!user) {
      return {
        ...promoCode,
        isEligible: false,
        motivationMessage: promoCode.criteria === 'user_nou'
          ? 'Creează un cont pentru a beneficia de această ofertă: WELCOME10 pentru 10%.'
          : promoCode.criteria === 'client_fidel'
          ? 'Creează un cont și plasează 5 comenzi pentru a beneficia de această ofertă: promo2 pentru 20%.'
          : 'Creează un cont pentru a beneficia de această ofertă.',
      };
    }

    const today = new Date();
    const joinDate = new Date(user.date);
    const daysSinceJoined = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));

    switch (promoCode.criteria) {
      case 'user_nou':
        return {
          ...promoCode,
          isEligible: daysSinceJoined <= 7,
          motivationMessage: daysSinceJoined > 7
            ? 'Te poți înregistra pentru a primi această ofertă în primele 7 zile de la înregistrare.'
            : '',
        };
      case 'client_fidel':
        return {
          ...promoCode,
          isEligible: orders.length >= 5,
          motivationMessage: orders.length < 5
            ? 'Plasează 5 comenzi pentru a beneficia de această ofertă.'
            : '',
        };
      default:
        return { ...promoCode, isEligible: true, motivationMessage: '' };
    }
  };

  const fetchPromoCodesForAuthenticatedUser = async (user, token) => {
    let fetchedPromoCodes = [];
    try {
      const generalResponse = await fetch('http://localhost:4000/api/promocodes/allpromocodes', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const generalData = await generalResponse.json();
      if (Array.isArray(generalData)) {
        fetchedPromoCodes = generalData;
      }
    } catch (error) {
      console.error('Error fetching general promo codes:', error);
    }

    try {
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
        const eligiblePromoCodes = await Promise.all(
          fetchedPromoCodes.map(promoCode => checkEligibility(promoCode, user, orders))
        );
        setPromoCodes(eligiblePromoCodes);
        console.log('Promo codes with eligibility:', eligiblePromoCodes);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const fetchPromoCodesForNonAuthenticatedUser = async () => {
    let fetchedPromoCodes = [];
    try {
      const generalResponse = await fetch('http://localhost:4000/api/promocodes/allpromocodes');
      const generalData = await generalResponse.json();
      if (Array.isArray(generalData)) {
        fetchedPromoCodes = generalData;
      }
      const eligiblePromoCodes = await Promise.all(
        fetchedPromoCodes.map(promoCode => checkEligibility(promoCode, null, []))
      );
      setPromoCodes(eligiblePromoCodes);
      console.log('Promo codes for non-authenticated users:', eligiblePromoCodes);
    } catch (error) {
      console.error('Error fetching general promo codes:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect executed in App.js');
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
          console.log('Fetched user data:', data);

          if (data.success) {
            setIsAuthenticated(true);
            setUserData(data.user);

            fetchPromoCodesForAuthenticatedUser(data.user, token);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('auth-token');
            fetchPromoCodesForNonAuthenticatedUser();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('auth-token');
          fetchPromoCodesForNonAuthenticatedUser();
        }
      };

      fetchUserData();
    } else {
      fetchPromoCodesForNonAuthenticatedUser();
    }
  }, [isAuthenticated]);

  console.log('Promo codes in App.js:', promoCodes);

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
          <Route path='/cart' element={<Cart promoCodes={promoCodes} />} />
          <Route path="/login" element={<LoginSignup onLogin={handleLogin} onSignup={handleSignup} isAuthenticated={isAuthenticated} />} />
          <Route path="/profil" element={isAuthenticated ? <Profil userData={userData} setIsAuthenticated={setIsAuthenticated}
            updateUserData={updateUserData} /> : <Navigate to="/login" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment" element={<PaymentMock />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      {promoCodes.length > 0 && (
        <PromoDisplay
          promoCodes={promoCodes}
          isMinimized={isPromoMinimized}
          onToggle={handleTogglePromoDisplay}
          isAuthenticated={isAuthenticated}

        />
      )}
    </div>
  );
}

export default App;
