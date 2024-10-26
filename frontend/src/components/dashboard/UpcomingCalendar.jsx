// src/components/UpcomingCalendar.jsx
import React from 'react';

function UpcomingCalendar() {
  // Example of highlighted dates
  const today = 28; // Set today's date as 28th for this example
  const upcomingChargeDate = 26;
  const chargeAmount = 19.31;

  return (
    <div className="bg-white p-6 shadow rounded-lg w-full">
      <h3 className="text-lg font-semibold mb-4">Coming Up</h3>
      <p className="text-sm text-gray-700 mb-4">
        You have 1 recurring charge due within the next 7 days for ${chargeAmount}.
      </p>
      
      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2 text-center text-gray-500 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <span key={index} className="text-xs font-medium">{day}</span>
        ))}

        {/* Days of the month */}
        {[...Array(31)].map((_, index) => {
          const day = index + 1;
          let bgClass = "text-gray-400"; // Default style for other dates
          
          if (day === today) {
            bgClass = "bg-purple-200 text-purple-600 font-bold rounded-full";
          } else if (day === upcomingChargeDate) {
            bgClass = "bg-purple-600 text-white font-bold rounded-full";
          }

          return (
            <span key={day} className={`text-sm p-2 ${bgClass}`}>
              {day}
            </span>
          );
        })}
      </div>

      {/* Upcoming Charge Info */}
      <div className="flex items-center mt-2">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
          G
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">Gym Membership (billing)</p>
          <p className="text-xs text-gray-500">in 2 days</p>
        </div>
        <p className="ml-auto text-sm font-bold text-gray-700">${chargeAmount.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default UpcomingCalendar;
