// src/pages/Retirement.jsx
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import mockRetirementData from '../data/mockRetirementData';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function Retirement() {
  const [trs, setTrs] = useState(0);
  const [four03b, setFour03b] = useState(0);
  const [ira, setIra] = useState(0);

  // Use mock data instead of fetching from an API
  useEffect(() => {
    setTrs(mockRetirementData.trs);
    setFour03b(mockRetirementData.four03b);
    setIra(mockRetirementData.ira);
  }, []);

  // Total monthly contribution
  const totalContribution = trs + four03b + ira;

  // Projection: 10-year projection with a 5% annual growth rate
  const years = Array.from({ length: 10 }, (_, i) => i + 1);
  const projectedSavings = years.map(
    (year) => totalContribution * 12 * ((1 + 0.05) ** year)
  );

  const data = {
    labels: years.map((year) => `${year} yr`),
    datasets: [
      {
        label: 'Projected Savings ($)',
        data: projectedSavings,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="retirement p-4">
      <h2 className="text-2xl font-bold mb-4">Retirement Planning</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">TRS Contribution</h3>
        <p className="text-lg">${trs.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">403(b) Contribution</h3>
        <p className="text-lg">${four03b.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">IRA Contribution</h3>
        <p className="text-lg">${ira.toFixed(2)}</p>
      </div>

      <div className="mt-4 mb-6">
        <h3 className="text-xl font-semibold">Total Monthly Contribution</h3>
        <p className="text-lg">${totalContribution.toFixed(2)}</p>
      </div>

      {/* Projection Chart */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Projected 10-Year Savings</h3>
        <Line data={data} />
      </div>
    </div>
  );
}

export default Retirement;
