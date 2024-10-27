import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaid } from '../data/plaidcontext';

const Login = () => {
  const navigate = useNavigate();
  const { addPlaidData } = usePlaid();
  const [plaidUserId, setPlaidUserId] = useState('');

  const handleLogin = async () => {
    if (plaidUserId) {
      try {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plaid_user_id: plaidUserId }),
        });

        if (response.ok) {
          const data = await response.json();
          addPlaidData(plaidUserId, data.teacher);
          navigate('/dashboard');
        } else {
          alert('Invalid Plaid user ID');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
      }
    } else {
      alert('Please enter a Plaid user ID');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg w-full max-w-md transition-all">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900">FinTeach</h1>
          <p className="text-gray-500">Financial Planning for Educators</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={plaidUserId}
              onChange={(e) => setPlaidUserId(e.target.value)}
              placeholder="Enter Plaid User ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
