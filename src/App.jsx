import React, { useEffect, useState} from 'react';
import { useLiff } from 'react-liff';
import './App.css';
import { loginWithLineId } from './api/business/login'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
// import Home from './pages/Home';
import { getUser } from "./api/strapi/userApi";
import { getShopByUserId } from "./api/strapi/shopApi";

const LiffPartner = import.meta.env.VITE_LIFF_ID;

const App = () => {
    const navigate = useNavigate();
    const {liff, error } = useLiff();
    const [loading, setLoading] = useState(true);
    // const [displayName, setDisplayName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const initializeLiff = async () => {
            try {
                // Check if liff is defined and has the init function
                if (typeof liff === 'undefined') {
                    console.error("LIFF is undefined. Please check if the SDK is loaded correctly.");
                    setErrorMessage("LIFF is not loaded. Please refresh the page.");
                    return;
                }

                // Verify the liff.init method exists
                if (typeof liff.init !== 'function') {
                    // console.error("LIFF init method is not a function. Please check your LIFF SDK version.");
                    setErrorMessage("LIFF is not initialized correctly. Please try again.");
                    return;
                }

                // Initialize LIFF
                await liff.init({ liffId: LiffPartner });
                // console.log("LIFF initialized successfully.");

                // const userId = localStorage.getItem("lineId");
                // const token = localStorage.getItem('token', token);
                // if (userId && token)
                // {
                //     console.log("userId login leaw: ", userId);
                //     // console.log("token login leaw: ", token);
                //     navigate('/home');
                // }

                if (liff.isLoggedIn()) {
                  const profile = await liff.getProfile();
                  const lineId = profile.userId;
                  console.log("lineId", lineId);
                  console.log("profile lineID", profile.displayName);
                  console.log("profile lineID", profile.lineId);
                  localStorage.setItem('displayName', profile.displayName);
                  localStorage.setItem('pictureUrl', profile.pictureUrl);
                  localStorage.setItem('lineId', lineId);
                  // Set display name from profile
                  // setDisplayName(profile.displayName + "xxxx");
                  const response = await loginWithLineId(lineId);

                  if(!response){
                    // This line is login fail
                    console.log("Login failed. Redirecting to sign up page...");
                    navigate('/partner/pdpa/0');
                    // return;
                  } else {
                    const token = response.jwt; // Access the token from the response
                    localStorage.setItem('token', token);
                    console.log('respons: ', response.jwt);
                    console.log('jwt: ', response.jwt);
                    console.log('Token saved to localStorage:', token);
                    const userData = await getUser(lineId, token);
                    console.log('userData in app: ', userData, userData.userType );
                    if (userData) {
                        localStorage.setItem('user', JSON.stringify(userData));
                        console.log('userData.userType: ', userData.userType );
                        if (userData.userType === "shop") {
                            // This line is login success
                            console.log("userData.id: ", userData.id);
                            const shopData = await getShopByUserId(userData.id, token);
                            if (shopData) {
                                console.log('shopData: ', shopData);
                                console.log('shopData.id: ', shopData.id);
                                localStorage.setItem('shopId', shopData.id);
                            }
                            console.log("Login successful. Redirecting to app...");
                            navigate('/partner/add-product');
                        } else if (userData.userType === "customer") {
                            console.log("hello customer");
                            navigate('/partner/pdpa/1');
                        } else {
                            // This line is login fail
                            console.log("Login failed. .");
                            navigate('/partner/pdpa/0');
                        }
                    }
                    // console.log("Login failed. Redirecting to sign up page...");
                    // navigate('/partner/pdpa/0');

                  }
                } else {
                    liff.login();
                }
            } catch (errorMessage) {
                console.error('Initialization or login error:', errorMessage);
                setErrorMessage('Initialization or login error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // initializeLiff();
        // if (isLoggedIn) {
        //   setLoading(true);
        // }
        initializeLiff();
    }, [liff, navigate]);

    if (loading) {
        return <div className="App"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="App"><p>Something went wrong: {error.message}</p></div>;
    }

    return (
        <div className="App">
        </div>
    );
};

export default App;
