import React, { useEffect, useState } from 'react';
import { useLiff } from 'react-liff';
import './App.css';
import { loginWithLineId } from './api/business/login';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { getUser } from "./api/strapi/userApi";
import { getShopByUserId } from "./api/strapi/shopApi";

const LiffPartner = import.meta.env.VITE_LIFF_ID;

const App = () => {
  const navigate = useNavigate();
  const { liff, error } = useLiff();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleAuthFlow = async () => {
      try {
        const token = localStorage.getItem('token');
        const lineId = localStorage.getItem('lineId');

        if (token && lineId) {
          const userData = await getUser(lineId, token);
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));

            if (userData.userType === 'shop') {
              const shopData = await getShopByUserId(userData.id, token);
              if (shopData) {
                localStorage.setItem('shopId', shopData.id);
                return navigate(shopData.approved ? '/partner/add-product' : '/partner/approval');
              }
            } else if (userData.userType === 'customer') {
              return navigate('/partner/pdpa/1');
            } else {
              return navigate('/partner/pdpa/0');
            }
          }
        }

        if (!liff || typeof liff.init !== 'function') {
          setErrorMessage('LIFF is not ready. Please try again.');
          return;
        }

        await liff.init({ liffId: LiffPartner });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        const newLineId = profile.userId;

        localStorage.setItem('displayName', profile.displayName);
        localStorage.setItem('pictureUrl', profile.pictureUrl);
        localStorage.setItem('lineId', newLineId);

        const loginRes = await loginWithLineId(newLineId);

        if (!loginRes || !loginRes.jwt) {
          return navigate('/partner/pdpa/0');
        }

        const jwt = loginRes.jwt;
        localStorage.setItem('token', jwt);

        const userData = await getUser(newLineId, jwt);
        if (!userData) return navigate('/partner/pdpa/0');

        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.userType === 'shop') {
          const shopData = await getShopByUserId(userData.id, jwt);
          if (shopData) {
            localStorage.setItem('shopId', shopData.id);
            return navigate(shopData.approved ? '/partner/add-product' : '/partner/approval');
          }
        } else if (userData.userType === 'customer') {
          return navigate('/partner/pdpa/1');
        } else {
          return navigate('/partner/pdpa/0');
        }

      } catch (err) {
        console.error('Auth error:', err);
        setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่');
      } finally {
        setLoading(false);
      }
    };

    handleAuthFlow();
  }, [liff, navigate]);

  if (loading) return <div className="App"><LoadingSpinner /></div>;
  if (error || errorMessage) return <div className="App"><p>{error?.message || errorMessage}</p></div>;

  return <div className="App"></div>;
};

export default App;