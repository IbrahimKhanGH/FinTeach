import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    const { firstName, lastName, dob, email, phone, address, username, password } = formData;

    if (email && username && password) {
      // Save user data (e.g., to localStorage)
      localStorage.setItem('user', JSON.stringify(formData));
      navigate('/dashboard');
    } else {
      alert('Please fill out all fields');
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
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 transform text-gray-400 transition-all pointer-events-none -translate-y-4 scale-90 bg-white px-1"
            >
              Email Address
            </label>
          </div>
          {/* Phone Number */}
  
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-2 transform text-gray-400 transition-all pointer-events-none -translate-y-4 scale-90 bg-white px-1"
            >
              Username
            </label>
          </div>
          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 transform text-gray-400 transition-all pointer-events-none -translate-y-4 scale-90 bg-white px-1"
            >
              Password
            </label>
          </div>

          <button
            className="w-full py-3 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
            onClick={handleSignup}
          >
            Sign Up
          </button>

          <div className="text-center mt-4">
            <button
              className="text-blue-900 hover:underline"
              onClick={() => navigate('/login')}
            >
              Already have an account? Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
