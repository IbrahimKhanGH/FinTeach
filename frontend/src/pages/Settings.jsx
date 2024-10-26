import React, { useState } from 'react';
import { 
  Settings, 
  Link, 
  UserCircle, 
  Shield, 
  Bell, 
  DollarSign,
  Wallet,
  PiggyBank,
  LineChart,
  Landmark,
  GraduationCap,
  Lock,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsNavigation = () => {
  const [showValues, setShowValues] = useState(false);

  const toggleShowValues = () => {
    setShowValues(!showValues);
  };

  const navItems = [
    {
      section: 'Account Management',
      items: [
        { name: 'Linked Accounts', icon: Link },
        { name: 'Profile Information', icon: UserCircle },
        { name: 'Security Settings', icon: Shield },
        { name: 'Notification Preferences', icon: Bell },
      ],
    },
    {
      section: 'Financial Profile',
      items: [
        { name: 'Income Settings', icon: DollarSign },
        { name: 'Monthly Expenses', icon: Wallet },
        { name: 'Savings Goals', icon: PiggyBank },
      ],
    },
    {
      section: 'Retirement & Investments',
      items: [
        { name: 'Retirement Goals', icon: LineChart },
        { name: 'Investment Preferences', icon: Landmark },
      ],
    },
    {
      section: 'Teacher Benefits',
      items: [
        { name: 'Teacher Retirement System', icon: GraduationCap },
        { name: 'Professional Development Funds', icon: LineChart },
      ],
    },
    {
      section: 'Privacy & Security',
      items: [
        { name: 'Data Sharing Preferences', icon: Lock },
        { name: 'Account Logout', icon: LogOut },
      ],
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-50 p-6 border-r">
          <div className="flex items-center gap-2 mb-8">
            <Settings className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          </div>

          <nav className="space-y-6">
            {navItems.map((section) => (
              <div key={section.section}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {section.section}
                </h2>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.name}>
                        <button
                          type="button"
                          className="w-full text-left flex items-center gap-3 p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => {
                            // Placeholder for future functionality
                          }}
                        >
                          <Icon className="w-5 h-5 text-gray-600" />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 space-y-16">
          {/* Eye Icon to toggle value visibility */}
          <div className="flex justify-end mb-6">
            <button onClick={toggleShowValues} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
              {showValues ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {showValues ? 'Hide Values' : 'Show Values'}
            </button>
          </div>

          {/* Sections */}
          {/* ... Rest of the sections remain the same ... */}
        </main>
      </div>
    </div>
  );
};

export default SettingsNavigation;
