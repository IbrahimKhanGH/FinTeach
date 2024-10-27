// src/pages/Retirement.jsx
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import mockRetirementData from "../data/mockRetirementData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Retirement() {
  // State Variables
  const [trs, setTrs] = useState(500); // TRS monthly contribution
  const [four03b, setFour03b] = useState(300); // 403(b) monthly contribution
  const [ira, setIra] = useState(200); // IRA monthly contribution
  const [otherInvestments, setOtherInvestments] = useState(0); // Other investments

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(20000);
  const [yearsOfService, setYearsOfService] = useState(5); // Years already worked
  const [salaryGrowthRate, setSalaryGrowthRate] = useState(2); // Annual salary increase %

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Investment Growth Rate based on risk tolerance
  const [riskTolerance, setRiskTolerance] = useState("moderate"); // Options: 'conservative', 'moderate', 'aggressive'

  // Determine annual growth rate
  const getAnnualGrowthRate = () => {
    switch (riskTolerance) {
      case "conservative":
        return 0.04;
      case "moderate":
        return 0.06;
      case "aggressive":
        return 0.08;
      default:
        return 0.06;
    }
  };

  const annualGrowthRate = getAnnualGrowthRate();

  // Total monthly contribution
  const totalContribution = trs + four03b + ira + otherInvestments;

  // Number of years until retirement
  const yearsUntilRetirement = retirementAge - currentAge;

  // Projected Savings Calculation
  const projectedSavingsAtRetirement = calculateProjectedSavings();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        borderColor: 'rgba(16, 185, 129, 0.8)', // Light green color
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Light green with opacity
      },
      point: {
        backgroundColor: 'rgba(16, 185, 129, 1)', // Solid light green for points
      }
    }
  };

  // Calculate Projected Savings
  function calculateProjectedSavings() {
    let savings = currentSavings;
    for (let i = 1; i <= yearsUntilRetirement; i++) {
      // Assume contributions increase with salary growth
      const adjustedContribution =
        totalContribution * Math.pow(1 + salaryGrowthRate / 100, i - 1);
      savings = (savings + adjustedContribution * 12) * (1 + annualGrowthRate);
    }
    return savings;
  }

  // Generate data for projection chart
  const years = Array.from(
    { length: yearsUntilRetirement + 1 },
    (_, i) => currentAge + i
  );
  const projectedSavingsOverTime = [];
  let savings = currentSavings;

  for (let i = 0; i <= yearsUntilRetirement; i++) {
    const adjustedContribution =
      totalContribution * Math.pow(1 + salaryGrowthRate / 100, i);
    savings =
      (savings + (i === 0 ? 0 : adjustedContribution * 12)) *
      (1 + (i === 0 ? 0 : annualGrowthRate));
    projectedSavingsOverTime.push(savings);
  }

  const lineChartData = {
    labels: years.map((age) => `Age ${age}`),
    datasets: [
      {
        label: "Projected Savings ($)",
        data: projectedSavingsOverTime,
        borderColor: "#5aa832",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
      },
    ],
  };

  // Pie Chart Data for Contribution Breakdown
  const pieChartData = {
    labels: ["TRS", "403(b)", "IRA", "Other"],
    datasets: [
      {
        data: [trs, four03b, ira, otherInvestments],
        backgroundColor: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"],
      },
    ],
  };

  // Bar Chart Data for Annual Savings Growth
  const barChartData = {
    labels: years.map((age) => `Age ${age}`),
    datasets: [
      {
        label: "Annual Savings Growth ($)",
        data: projectedSavingsOverTime.map((savings, index) =>
          index === 0 ? savings : savings - projectedSavingsOverTime[index - 1]
        ),
        backgroundColor: "#22c55e",
      },
    ],
  };

  // Estimate TRS Pension Benefit
  const estimateTrsPension = () => {
    const totalYearsOfService = yearsOfService + yearsUntilRetirement;
    const averageSalary =
      55000 * Math.pow(1 + salaryGrowthRate / 100, yearsUntilRetirement / 2); // Assume average salary increases over time
    const multiplier = 0.023;
    const pension = averageSalary * totalYearsOfService * multiplier;
    return pension;
  };

  // Retirement Eligibility Check (Rule of 80)
  const isEligibleForFullRetirement = () => {
    const totalYearsOfService = yearsOfService + yearsUntilRetirement;
    const agePlusService = retirementAge + totalYearsOfService;
    return agePlusService >= 80;
  };

  // New state for managing which graph is displayed
  const [activeGraph, setActiveGraph] = useState("projected");

  // New calculations for additional graphs
  const calculateRetirementIncome = () => {
    const monthlyPension = estimateTrsPension() / 12;
    const monthlySavingsDrawdown = (projectedSavingsAtRetirement * 0.04) / 12; // Using 4% rule
    return Array(30).fill().map((_, i) => ({
      year: retirementAge + i,
      income: monthlyPension + monthlySavingsDrawdown
    }));
  };

  const retirementIncomeData = {
    labels: calculateRetirementIncome().map(d => d.year),
    datasets: [{
      label: 'Monthly Retirement Income',
      data: calculateRetirementIncome().map(d => d.income),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const graphComponents = {
    projected: (
      <Line data={lineChartData} options={chartOptions} />
    ),
    breakdown: (
      <Pie data={pieChartData} options={chartOptions} />
    ),
    annual: (
      <Bar data={barChartData} options={chartOptions} />
    ),
    income: (
      <Line data={retirementIncomeData} options={{
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          title: {
            display: true,
            text: 'Projected Monthly Retirement Income'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Monthly Income ($)'
            }
          }
        }
      }} />
    )
  };

  // Add this function to calculate savings milestones
  const calculateSavingsMilestones = () => {
    const milestones = [100000, 250000, 500000, 1000000];
    return milestones.map(milestone => {
      const yearsToMilestone = projectedSavingsOverTime.findIndex(savings => savings >= milestone);
      return {
        milestone: `$${milestone.toLocaleString()}`,
        age: yearsToMilestone === -1 ? 'N/A' : currentAge + yearsToMilestone,
      };
    });
  };

  const savingsMilestones = calculateSavingsMilestones();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-[#025742]">Retirement Planning</h1>
        <p className="text-lg text-center mb-8 text-gray-600">Plan your financial future with confidence</p>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left column: Your Information */}
          <div className="bg-white p-6 rounded-lg shadow lg:w-1/3">
            <h2 className="text-2xl font-semibold mb-4 text-[#025742]">Your Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Age: {currentAge}</label>
                <input
                  type="range"
                  min="20"
                  max="70"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    '&::-webkit-slider-thumb': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      background: '#5aa832',
                      cursor: 'pointer',
                      borderRadius: '50%'
                    },
                    '&::-moz-range-thumb': {
                      width: '16px',
                      height: '16px',
                      background: '#5aa832',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      border: 'none'
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Retirement Age: {retirementAge}</label>
                <input
                  type="range"
                  min={currentAge + 1}
                  max="70"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    '&::-webkit-slider-thumb': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%'
                    },
                    '&::-moz-range-thumb': {
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      border: 'none'
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Current Savings</label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Risk Tolerance</label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="conservative">Conservative (4% growth)</option>
                  <option value="moderate">Moderate (6% growth)</option>
                  <option value="aggressive">Aggressive (8% growth)</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-3 text-[#025742]">Monthly Contributions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">TRS: ${trs}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={trs}
                  onChange={(e) => setTrs(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    '&::-webkit-slider-thumb': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%'
                    },
                    '&::-moz-range-thumb': {
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      border: 'none'
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">403(b): ${four03b}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={four03b}
                  onChange={(e) => setFour03b(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    '&::-webkit-slider-thumb': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%'
                    },
                    '&::-moz-range-thumb': {
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      border: 'none'
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IRA: ${ira}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={ira}
                  onChange={(e) => setIra(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    '&::-webkit-slider-thumb': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%'
                    },
                    '&::-moz-range-thumb': {
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      border: 'none'
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Other: ${otherInvestments}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={otherInvestments}
                  onChange={(e) => setOtherInvestments(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    '&::-webkit-slider-thumb': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%'
                    },
                    '&::-moz-range-thumb': {
                      width: '16px',
                      height: '16px',
                      background: '#025742',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      border: 'none'
                    }
                  }}
                />
              </div>
            </div>
            
            <p className="mt-4 text-lg font-semibold text-[#025742]">
              Total Monthly Contribution: ${totalContribution}
            </p>
          </div>
          
          {/* Right column: Retirement Summary and Graphs */}
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 text-[#025742]">Retirement Summary</h2>
              <p className="text-lg mb-2">
                At age {retirementAge}, you will have approximately{" "}
                <span className="font-semibold text-emerald-600">
                  ${projectedSavingsAtRetirement.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>{" "}
                in savings.
              </p>
              <p className="text-lg">
                Estimated Annual TRS Pension Benefit:{" "}
                <span className="font-semibold text-emerald-600">
                  ${estimateTrsPension().toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </p>
            </div>
            
            {/* Graph section with switcher */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="text-xl font-semibold mb-2 text-[#025742]">Retirement Projections</h3>
                <div className="space-x-2 mb-2">
                  {Object.keys(graphComponents).map((graphType) => (
                    <button
                      key={graphType}
                      className={`px-3 py-1 rounded mb-1 ${
                        activeGraph === graphType
                          ? "bg-[#025742] text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                      onClick={() => setActiveGraph(graphType)}
                    >
                      {graphType.charAt(0).toUpperCase() + graphType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ height: "400px" }}>
                {graphComponents[activeGraph]}
              </div>
            </div>
            
            {/* Savings Milestones Table */}
            <div className="bg-white p-6 rounded-lg shadow mt-8">
              <h3 className="text-xl font-semibold mb-4 text-[#025742]">Savings Milestones</h3>
              <table className="w-full">
                <thead className="bg-emerald-100">
                  <tr>
                    <th className="text-left p-2">Milestone</th>
                    <th className="text-left p-2">Projected Age</th>
                  </tr>
                </thead>
                <tbody>
                  {savingsMilestones.map((milestone, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2">{milestone.milestone}</td>
                      <td className="p-2">{milestone.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Retirement;
