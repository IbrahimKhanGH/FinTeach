// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UpcomingCalendar from "../components/dashboard/UpcomingCalendar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Import JSON data for different career stages
import earlyCareerData from '../data/early_career.json';
import middleCareerData from '../data/middle_career.json';
import lateCareerData from '../data/late_career.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const navigate = useNavigate();
  const [careerStage, setCareerStage] = useState(() => {
    return localStorage.getItem('careerStage') || 'early';
  });

  const [userName, setUserName] = useState('');

  // State variables for financial data
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [monthlyInvestments, setMonthlyInvestments] = useState(0);
  const [retirementReadiness, setRetirementReadiness] = useState(0);

  const getRetirementGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const getRetirementGradeColor = (grade) => {
    switch (grade) {
      case "A+":
      case "A":
        return "#16a34a"; // green-600
      case "B":
        return "#f97316"; // orange-500
      case "C":
        return "#eab308"; // yellow-500
      case "D":
      case "F":
        return "#dc2626"; // red-600
      default:
        return "#4b5563"; // gray-600
    }
  };

  useEffect(() => {
    let data;
    switch (careerStage) {
      case 'early':
        data = earlyCareerData;
        setUserName('Alex');
        break;
      case 'middle':
        data = middleCareerData;
        setUserName('Maria');
        break;
      case 'late':
        data = lateCareerData;
        setUserName('James');
        break;
      default:
        data = earlyCareerData;
        setUserName('Alex');
    }

    // Update state variables
    setMonthlyIncome(data.financial_info.monthly_net_income);
    setMonthlyExpenses(data.financial_info.monthly_expenses);
    setCurrentSavings(data.financial_info.current_savings);
    setSavingsGoal(data.retirement_readiness.retirement_goal);
    setMonthlyInvestments(data.financial_info.monthly_investments);
    setRetirementReadiness(data.retirement_readiness.percentage_of_goal);

  }, [careerStage]);

  const cashFlowData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Monthly Cash Flow",
        data: [monthlyIncome, monthlyExpenses],
        backgroundColor: ["#10B981", "#EF4444"], // Green for income, red for expenses
      },
    ],
  };

  return (
    <div className="min-h-screen p-6">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-[#025742] to-emerald-800 rounded-lg overflow-hidden shadow-md">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Welcome back, {userName}</h1>
            <p className="text-sm text-white/90 mt-1">Here is your financial overview</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Retirement Grade */}
          <div className="bg-white p-6 shadow-sm rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Retirement Readiness</h2>
            <div className="relative w-40 h-40 mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getRetirementGradeColor(getRetirementGrade(retirementReadiness))}
                  strokeWidth="3"
                  strokeDasharray={`${retirementReadiness}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{retirementReadiness}%</span>
                <span className={`text-2xl font-bold`} style={{ color: getRetirementGradeColor(getRetirementGrade(retirementReadiness)) }}>
                  {getRetirementGrade(retirementReadiness)}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { label: "Monthly Income", value: monthlyIncome, color: "text-green-600" },
                { label: "Monthly Expenses", value: monthlyExpenses, color: "text-red-600" },
                { label: "Current Savings", value: currentSavings, color: "text-blue-600" },
                { label: "Monthly Investments", value: monthlyInvestments, color: "text-purple-600" },
              ].map((item, index) => (
                <div key={index} className="bg-white p-4 shadow-sm rounded-xl flex flex-col items-center">
                  <h3 className="text-sm font-semibold mb-2 text-gray-600">{item.label}</h3>
                  <p className={`text-2xl font-bold ${item.color}`}>
                    ${item.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Cash Flow */}
          <div className="bg-white p-6 shadow-sm rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Cash Flow
            </h3>
            <div style={{ height: "300px" }}>
              <Bar
                data={cashFlowData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 shadow-sm rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Transactions
            </h3>
            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {careerStage === 'early' && earlyCareerData.transactions.slice(0, 5).map((transaction, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm text-gray-700 bg-gray-50 p-3 rounded-lg"
                >
                  <span>
                    {transaction.date} - {transaction.description}
                  </span>
                  <span className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </li>
              ))}
              {careerStage === 'middle' && middleCareerData.transactions.slice(0, 5).map((transaction, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm text-gray-700 bg-gray-50 p-3 rounded-lg"
                >
                  <span>
                    {transaction.date} - {transaction.description}
                  </span>
                  <span className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </li>
              ))}
              {careerStage === 'late' && lateCareerData.transactions.slice(0, 5).map((transaction, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm text-gray-700 bg-gray-50 p-3 rounded-lg"
                >
                  <span>
                    {transaction.date} - {transaction.description}
                  </span>
                  <span className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Financial Tip of the Day */}
        <div className="bg-white p-6 shadow-sm rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Financial Tip of the Day
          </h3>
          <p className="text-sm text-gray-700 bg-green-50 border-l-4 border-[#025742] p-4 rounded-r-lg">
            {careerStage === 'early' && "Start saving early to take advantage of compound interest over time."}
            {careerStage === 'middle' && "Consider increasing your retirement contributions as your salary grows."}
            {careerStage === 'late' && "Review your retirement plan to ensure you're on track to meet your goals."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
