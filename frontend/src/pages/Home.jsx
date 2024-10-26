import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, PieChart, Target, Shield, Book, Calculator } from 'lucide-react';

// Simple custom Card component
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-fidelity-green to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Smart Financial Planning for Texas Teachers
              </h1>
              <p className="text-xl text-gray-100 mb-8">
                Take control of your financial future with our AI-powered platform designed exclusively for educators.
              </p>
              <div className="flex space-x-4">
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center px-6 py-3 bg-white text-fidelity-green rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/retirement" 
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-2xl p-8">
                <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                  <Calculator className="h-32 w-32 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Secure Your Future
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform helps you manage your finances, plan retirement, and achieve your financial goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-fidelity-green/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-fidelity-green p-8 md:p-12 lg:p-16 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Texas teachers who are already planning their secure financial future with our platform.
            </p>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-8 py-4 bg-white text-fidelity-green rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Features array
const features = [
  {
    icon: <DollarSign className="h-6 w-6 text-fidelity-green" />,
    title: "Budget Management",
    description: "Track your expenses and manage your budget with our intuitive tools designed for educators."
  },
  {
    icon: <PieChart className="h-6 w-6 text-fidelity-green" />,
    title: "Retirement Planning",
    description: "Get personalized retirement strategies with our AI-powered Fidelity integration."
  },
  {
    icon: <Target className="h-6 w-6 text-fidelity-green" />,
    title: "Goal Setting",
    description: "Set and track your financial goals with customized savings plans and milestones."
  },
  {
    icon: <Shield className="h-6 w-6 text-fidelity-green" />,
    title: "TRS Integration",
    description: "Seamlessly connect with Texas Retirement System for comprehensive benefit tracking."
  },
  {
    icon: <Book className="h-6 w-6 text-fidelity-green" />,
    title: "Financial Education",
    description: "Access resources and guides specifically curated for Texas educators."
  },
  {
    icon: <Calculator className="h-6 w-6 text-fidelity-green" />,
    title: "Smart Calculator",
    description: "Calculate your retirement benefits and explore different scenarios with our tools."
  }
];