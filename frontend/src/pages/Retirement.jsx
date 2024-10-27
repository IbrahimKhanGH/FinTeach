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

// Import JSON data for different career stages
import earlyCareerData from "../data/early_career.json";
import middleCareerData from "../data/middle_career.json";
import lateCareerData from "../data/late_career.json";

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
  // Career Stage Selection
  const [careerStage, setCareerStage] = useState('early');

  // Initial Data State
  const [initialData, setInitialData] = useState({});

  // State Variables
  const [trs, setTrs] = useState(0); // TRS monthly contribution
  const [four03b, setFour03b] = useState(0); // 403(b) monthly contribution
  const [ira, setIra] = useState(0); // IRA monthly contribution
  const [otherInvestments, setOtherInvestments] = useState(0); // Other investments

  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [yearsOfService, setYearsOfService] = useState(0); // Years already worked
  const [salaryGrowthRate, setSalaryGrowthRate] = useState(2); // Annual salary increase %

  // Investment Growth Rate based on risk tolerance
  const [riskTolerance, setRiskTolerance] = useState("moderate"); // Options: 'conservative', 'moderate', 'aggressive'

  // Total monthly contribution
  const [totalContribution, setTotalContribution] = useState(0);

  // New state for warning message
  const [retirementWarning, setRetirementWarning] = useState('');

  const [retirementAccounts, setRetirementAccounts] = useState(0);

  // Effect to update initial data based on career stage
  useEffect(() => {
    let data;
    switch (careerStage) {
      case 'early':
        data = earlyCareerData;
        break;
      case 'middle':
        data = middleCareerData;
        break;
      case 'late':
        data = lateCareerData;
        break;
      default:
        data = earlyCareerData;
    }

    console.log('Loaded data:', data); // Debug log

    const personalInfo = data.personal_info;
    const financialInfo = data.financial_info;

    setTrs(financialInfo.monthly_contributions.TRS);
    setFour03b(financialInfo.monthly_contributions['403b']);
    setIra(financialInfo.monthly_contributions.IRA);
    setOtherInvestments(financialInfo.monthly_contributions.Other);
    setCurrentAge(personalInfo.current_age);
    setRetirementAge(personalInfo.retirement_age);
    setCurrentSavings(financialInfo.current_savings);
    setYearsOfService(personalInfo.years_of_service);
    setRiskTolerance(personalInfo.risk_tolerance.toLowerCase());
    setRetirementAccounts(financialInfo.retirement_accounts || 0);

    console.log('Updated state:', { trs, four03b, ira, otherInvestments, currentAge, retirementAge, currentSavings, yearsOfService, riskTolerance, retirementAccounts }); // Debug log

    // Set initial data state
    const initData = {
      trs: financialInfo.monthly_contributions.TRS || 0,
      four03b: financialInfo.monthly_contributions["403b"] || 0,
      ira: financialInfo.monthly_contributions.IRA || 0,
      otherInvestments: financialInfo.monthly_contributions.Other || 0,
      currentAge: personalInfo.current_age || 25,
      retirementAge: personalInfo.retirement_age || 65,
      currentSavings: financialInfo.current_savings || 0,
      yearsOfService: personalInfo.years_of_service || 0,
      riskTolerance: personalInfo.risk_tolerance.toLowerCase() || "moderate",
      retirementAccounts: financialInfo.retirement_accounts || 0,
    };

    setInitialData(initData);

    // Initialize state variables with user's data
    setTrs(initData.trs);
    setFour03b(initData.four03b);
    setIra(initData.ira);
    setOtherInvestments(initData.otherInvestments);
    setCurrentAge(initData.currentAge);
    setRetirementAge(initData.retirementAge);
    setCurrentSavings(initData.currentSavings);
    setYearsOfService(initData.yearsOfService);
    setRiskTolerance(initData.riskTolerance);
    setRetirementAccounts(initData.retirementAccounts);

    // Update total contribution
    setTotalContribution(
      initData.trs + initData.four03b + initData.ira + initData.otherInvestments
    );
  }, [careerStage]);

  // Function to reset values to initial data
  const resetToInitialData = () => {
    setTrs(initialData.trs);
    setFour03b(initialData.four03b);
    setIra(initialData.ira);
    setOtherInvestments(initialData.otherInvestments);
    setCurrentAge(initialData.currentAge);
    setRetirementAge(initialData.retirementAge);
    setCurrentSavings(initialData.currentSavings);
    setYearsOfService(initialData.yearsOfService);
    setRiskTolerance(initialData.riskTolerance);
    setRetirementAccounts(initialData.retirementAccounts);

    // Update total contribution
    setTotalContribution(
      initialData.trs +
      initialData.four03b +
      initialData.ira +
      initialData.otherInvestments
    );
  };

  // Update total contribution when any contribution changes
  useEffect(() => {
    setTotalContribution(trs + four03b + ira + otherInvestments);
  }, [trs, four03b, ira, otherInvestments]);

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

  // Number of years until retirement
  const yearsUntilRetirement = retirementAge - currentAge;

  // Projected Savings Calculation
  const projectedSavingsAtRetirement = calculateProjectedSavings();

  const chartOptions = {
    responsive: true,
    
    tainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString();
          }
        }
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
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return '$' + context.parsed.y.toLocaleString();
          }
        }
      }
    }
  };

  // Calculate Projected Savings
  function calculateProjectedSavings() {
    let savings = currentSavings + retirementAccounts;
    console.log('Initial savings:', savings);
    console.log('Years until retirement:', yearsUntilRetirement);
    console.log('Total monthly contribution:', totalContribution);
    console.log('Salary growth rate:', salaryGrowthRate);
    console.log('Annual growth rate:', annualGrowthRate);

    for (let i = 1; i <= yearsUntilRetirement; i++) {
      const adjustedContribution =
        totalContribution * Math.pow(1 + salaryGrowthRate / 100, i - 1);
      savings = (savings + adjustedContribution * 12) * (1 + annualGrowthRate);
      console.log(`Year ${i} savings: ${savings}`);
    }
    return savings;
  }

  // Generate data for projection chart
  const years = Array.from(
    { length: yearsUntilRetirement + 1 },
    (_, i) => currentAge + i
  );
  const projectedSavingsOverTime = [];
  let savings = currentSavings + retirementAccounts; // Start with total current savings

  // Calculate yearly savings growth
  const yearlyGrowth = [];
  for (let i = 0; i <= yearsUntilRetirement; i++) {
    const adjustedContribution =
      totalContribution * Math.pow(1 + salaryGrowthRate / 100, i);
    const annualContribution = adjustedContribution * 12;
    const investmentGrowth = i === 0 ? 0 : savings * annualGrowthRate;
    const totalGrowth = annualContribution + investmentGrowth;
    
    yearlyGrowth.push(totalGrowth);
    savings += totalGrowth;
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
        data: projectedSavingsOverTime,
        backgroundColor: "#22c55e",
      },
    ],
  };

  // Estimate TRS Pension Benefit
  const estimateTrsPension = () => {
    const totalYearsOfService = yearsOfService + (retirementAge - currentAge);
    const averageSalary = 55000 * Math.pow(1 + salaryGrowthRate / 100, (retirementAge - currentAge) / 2);
    const multiplier = 0.023;
    let pension = averageSalary * totalYearsOfService * multiplier;

    // Apply early retirement reduction if applicable
    if (retirementAge < 62 && retirementAge + totalYearsOfService < 80) {
      const yearsEarly = Math.min(62 - retirementAge, 7); // Max 7 years early
      const reduction = 0.05 * yearsEarly; // 5% per year
      pension *= (1 - reduction);
    }

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

  // Update the current age input
  const handleCurrentAgeChange = (newAge) => {
    const age = Number(newAge);
    setCurrentAge(age);
    if (age >= retirementAge) {
      setRetirementAge(Math.min(age + 1, 70));
    }
    checkRetirementEligibility(retirementAge);
  };

  // Update the retirement age input
  const handleRetirementAgeChange = (newAge) => {
    const age = Number(newAge);
    setRetirementAge(age);
    if (age <= currentAge) {
      setCurrentAge(Math.max(age - 1, 20));
    }
    checkRetirementEligibility(age);
  };

  // Update the years of service input
  const handleYearsOfServiceChange = (newYears) => {
    const years = Number(newYears);
    setYearsOfService(years);
    checkRetirementEligibility(retirementAge);
  };

  // Check retirement eligibility and set warning
  const checkRetirementEligibility = (age) => {
    const totalYearsOfService = yearsOfService + (age - currentAge);
    if (age < 55) {
      setRetirementWarning('Minimum retirement age is 55.');
    } else if (age < 65 && totalYearsOfService < 5) {
      setRetirementWarning('You need at least 5 years of service to retire before 65.');
    } else if (age < 62 && age + totalYearsOfService < 80) {
      setRetirementWarning('You may face early retirement reductions. Consider working until you meet the Rule of 80 or reach age 62.');
    } else {
      setRetirementWarning('');
    }
  };

  // Add this function to handle retirement accounts change
  const handleRetirementAccountsChange = (newValue) => {
    setRetirementAccounts(Number(newValue));
  };

  const calculateSavings = (targetAge) => {
    let savings = currentSavings;
    const monthlyContribution = (monthlySavings + monthlyTrsContribution) * 12;
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const yearsAfterRetirement = Math.max(0, targetAge - retirementAge);

    // Calculate savings up to retirement
    for (let i = 0; i < yearsToRetirement; i++) {
      savings = savings * (1 + returnRate / 100) + monthlyContribution;
    }

    // Calculate savings after retirement (assuming no more contributions and a lower return rate)
    const postRetirementReturnRate = returnRate * 0.75; // Assume 75% of pre-retirement return rate
    for (let i = 0; i < yearsAfterRetirement; i++) {
      savings = savings * (1 + postRetirementReturnRate / 100);
      // Consider subtracting annual withdrawals here if applicable
    }

    return savings;
  };

  return (
    <div className="  min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-[#025742]">Retirement Planning</h1>
        <p className="text-lg text-center mb-8 text-gray-600">Plan your financial future with confidence</p>

        {/* Career Stage Selection */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="careerStage" className="font-semibold text-gray-700">Select Career Stage:</label>
            <select
              id="careerStage"
              value={careerStage}
              onChange={(e) => setCareerStage(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="early">Early Career</option>
              <option value="middle">Middle Career</option>
              <option value="late">Late Career</option>
            </select>
            <button
              onClick={resetToInitialData}
              className="ml-4 bg-[#025742] text-white px-4 py-2 rounded-md hover:bg-[#013D2C] transition"
            >
              Reset to My Info
            </button>
          </div>
        </div>

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
                  max="69"
                  value={currentAge}
                  onChange={(e) => handleCurrentAgeChange(e.target.value)}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Retirement Age: {retirementAge}</label>
                <input
                  type="range"
                  min="55"
                  max="70"
                  value={retirementAge}
                  onChange={(e) => handleRetirementAgeChange(e.target.value)}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                />
                {retirementWarning && (
                  <p className="text-yellow-600 text-sm mt-1">{retirementWarning}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Savings: ${currentSavings}</label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="1000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Retirement Accounts: ${retirementAccounts}</label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="5000"
                  value={retirementAccounts}
                  onChange={(e) => handleRetirementAccountsChange(e.target.value)}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
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

              <div>
                <label className="block text-sm font-medium mb-1">Years of Service: {yearsOfService}</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={yearsOfService}
                  onChange={(e) => handleYearsOfServiceChange(e.target.value)}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                />
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
