import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CareerStageSelection = () => {
  const [careerStage, setCareerStage] = useState('early');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store the selected career stage in localStorage
    localStorage.setItem('careerStage', careerStage);
    // Redirect to Dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">CHOOSE DEMO CAREER STAGE</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="careerStage" className="block text-sm font-medium text-gray-700 mb-2">
              Career Stage:
            </label>
            <select
              id="careerStage"
              value={careerStage}
              onChange={(e) => setCareerStage(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="early">Early Career</option>
              <option value="middle">Middle Career</option>
              <option value="late">Late Career</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#025742] text-white py-2 rounded hover:bg-[#013D2C] transition duration-300"
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerStageSelection;
