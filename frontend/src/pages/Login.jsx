import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    if (username && password) {
      // Retrieve user data from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (
        storedUser &&
        storedUser.username === username &&
        storedUser.password === password
      ) {
        // Redirect to CareerStageSelection
        navigate('/career-stage-selection');
      } else {
        alert('Invalid username or password');
      }
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg w-full max-w-md transition-all">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900">FinTeach</h1>
          <p className="text-gray-500">Financial Planning for Educators</p>
        </div>

        <button
          className="w-full py-3 my-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          onClick={() => navigate('/signup')}
        >
          Create Account
        </button>

        <div className="flex items-center my-4 text-gray-500">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>


        <form onSubmit={handleSubmit}>
          <div className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                name="username"
                value={credentials.username}
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
            <div className="relative">
              <input
                type="password"
                name="password"
                value={credentials.password}
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
              type="submit"
              className="w-full py-3 mt-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
