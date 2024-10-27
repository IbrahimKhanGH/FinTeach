import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Eye, EyeOff, LogOut, User, Lock, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const [showValues, setShowValues] = useState(false);
  const navigate = useNavigate();

  const toggleShowValues = () => setShowValues(!showValues);

  const handleLogout = () => navigate('/login'); // Redirects to login on logout

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#025742] to-emerald-800 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
              </div>
              <button
                onClick={toggleShowValues}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                {showValues ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {showValues ? 'Hide Values' : 'Show Values'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6 sm:p-8">
            <form className="space-y-8">
              {/* Personal Information Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', id: 'first-name', defaultValue: 'John', type: 'text', icon: User },
                    { label: 'Last Name', id: 'last-name', defaultValue: 'Doe', type: 'text', icon: User },
                    { label: 'Date of Birth', id: 'dob', defaultValue: '1990-01-01', type: 'date' },
                    { label: 'Email Address', id: 'email', defaultValue: 'john.doe@example.com', type: 'email' },
                    { label: 'Phone Number', id: 'phone', defaultValue: '+1 (555) 123-4567', type: 'tel' },
                    { label: 'Address', id: 'address', defaultValue: '123 Main St', type: 'text' },
                  ].map(({ label, id, defaultValue, type, icon: Icon }) => (
                    <div key={id} className="relative">
                      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <div className="relative rounded-md shadow-sm">
                        {Icon && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        )}
                        <input
                          type={showValues ? type : 'password'}
                          id={id}
                          name={id}
                          defaultValue={defaultValue}
                          className={`block w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${Icon ? 'pl-10' : ''}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Account Information Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type={showValues ? 'text' : 'password'}
                        id="username"
                        name="username"
                        defaultValue="johndoe"
                        className="block w-full pl-10 rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        defaultValue="password123"
                        className="block w-full pl-10 pr-10 rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          className="text-emerald-600 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">You can reset your password via email.</p>
                  </div>
                </div>
              </section>

              {/* Save Changes Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Save Changes
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
