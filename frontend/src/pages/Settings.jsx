import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Eye, EyeOff, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const [showValues, setShowValues] = useState(false);
  const navigate = useNavigate();

  const toggleShowValues = () => setShowValues(!showValues);

  const handleLogout = () => navigate('/login'); // Redirects to login on logout

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
          </div>
          <button
            onClick={toggleShowValues}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {showValues ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showValues ? 'Hide Values' : 'Show Values'}
          </button>
        </div>

        {/* Profile Form */}
        <form className="space-y-8">
          {/* Personal Information Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'First Name', id: 'first-name', defaultValue: 'John', type: 'text' },
                { label: 'Last Name', id: 'last-name', defaultValue: 'Doe', type: 'text' },
                { label: 'Date of Birth', id: 'dob', defaultValue: '1990-01-01', type: 'date' },
                { label: 'Email Address', id: 'email', defaultValue: 'john.doe@example.com', type: 'email' },
                { label: 'Phone Number', id: 'phone', defaultValue: '+1 (555) 123-4567', type: 'tel' },
                { label: 'Address', id: 'address', defaultValue: '123 Main St', type: 'text' },
              ].map(({ label, id, defaultValue, type }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={showValues ? type : 'password'}
                    id={id}
                    name={id}
                    defaultValue={defaultValue}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Account Information Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type={showValues ? 'text' : 'password'}
                  id="username"
                  name="username"
                  defaultValue="johndoe"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  defaultValue="password123"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-2 text-sm text-gray-500">You can reset your password via email.</p>
              </div>
            </div>
          </section>

          {/* Logout Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
