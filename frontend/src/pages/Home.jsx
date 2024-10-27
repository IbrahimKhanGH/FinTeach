import React from 'react';
import { Link } from 'react-router-dom';
import teacherSVG from "../assets/teacher.svg";
import greenpiggy from "/Green Piggy Bank with Graduation Cap.png";

export default function Home() {
  return (
    <div className="flex flex-row min-h-screen bg-white">
      {/* Text and CTA Section */}
      <div className="w-[50%] flex flex-col justify-center items-start p-8 bg-cream">
        <div className="flex items-center mb-4">
          <img src={greenpiggy} alt="FinTeach Logo" className="h-16 w-auto mr-2 italic" />
          <h1 className="text-5xl md:text-6xl font-bold text-[#5aa832] mb-4 italic">
            FinTeach
          </h1>
        </div>
        <h2 className="text-2xl md:text-3xl text-gray-700 font-light mb-4">
          Financial Planning for Texas Teachers
        </h2>
        <hr className="border-t-4 border-[#5aa832]  mb-4 w-1/4" />
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Smart budgeting, retirement planning, and investment tools designed exclusively for educators.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <button className="bg-fidelity-green text-white font-semibold py-3 px-6 text-lg md:text-xl rounded-full hover:bg-[#4c8f2a] focus:outline-none focus:ring-2 focus:ring-[#5aa832] focus:ring-offset-2 transition duration-300 ease-in-out">
              Get Started
            </button>
          </Link>
          <Link to="/retirement" className="text-[#5aa832] hover:text-[#4c8f2a] text-base md:text-lg underline">
            Learn More
          </Link>
        </div>
      </div>

      {/* SVG Image Section */}
      <div className="w-[50%] h-screen bg-fidelity-blue relative">
        <img 
          src={teacherSVG} 
          alt="Teacher illustration" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}
