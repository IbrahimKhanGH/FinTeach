import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaidAccountSelection = () => {
  const navigate = useNavigate();

  const handleAccountSelection = (careerStage) => {
    // Store the selected career stage in localStorage
    localStorage.setItem('selectedCareerStage', careerStage);
    // Redirect to the dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Select Your Plaid Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose an account to continue
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <button
              onClick={() => handleAccountSelection('early')}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Early Career Account
            </button>
            <button
              onClick={() => handleAccountSelection('middle')}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Middle Career Account
            </button>
            <button
              onClick={() => handleAccountSelection('late')}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Late Career Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaidAccountSelection;
