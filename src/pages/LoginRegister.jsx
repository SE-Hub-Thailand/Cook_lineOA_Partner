import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const lineId = localStorage.getItem('lineId');
    if (token && lineId) {
      navigate('/partner/add-product'); // Default to main if already logged in
    }
  }, [navigate]);

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/'); // Redirect to LIFF auth
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Welcome to Cook Project
      </h1>

      <p className="text-gray-700 text-center mb-8 max-w-xl">
        Recycle smarter. Earn rewards. Join our platform to exchange used cans or bottles
        for exciting rewards from our partner stores.
      </p>

      <div className="flex space-x-4">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded shadow"
          onClick={handleRegister}
        >
          Register
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
          onClick={handleLogin}
        >
          Login with LINE
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;