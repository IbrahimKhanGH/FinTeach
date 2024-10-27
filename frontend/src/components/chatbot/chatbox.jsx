// src/components/chatbot/chatbox.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import earlyCareerData from '../../data/early_career.json';
import middleCareerData from '../../data/middle_career.json';
import lateCareerData from '../../data/late_career.json';

const Chatbox = ({ careerStage }) => { // Accept careerStage as a prop
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false); // New state for maximize/minimize
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Determine which data to use based on careerStage
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    const assistantPrompt = `You are a helpful assistant specializing in ${careerStage} career financial planning. Here is relevant data: ${JSON.stringify(data)}`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: assistantPrompt },
            ...messages,
            userMessage,
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          className="w-14 h-14 rounded-full bg-green-600 border-none cursor-pointer flex justify-center items-center shadow-lg hover:bg-green-700 transition-colors duration-200"
          onClick={() => setIsOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
      {isOpen && (
        <div
          className={`${
            isMaximized ? 'w-11/12 h-5/6' : 'w-80 h-96'
          } bg-white rounded-lg shadow-lg flex flex-col fixed bottom-5 right-5 z-50 transition-all duration-200`}
        >
          <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* Maximize/Minimize Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-white text-lg font-bold hover:text-gray-200"
              >
                {isMaximized ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6m-6 6h6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
              <h3 className="text-lg font-semibold">FinTeach Assistant</h3>
            </div>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  message.role === 'user' ? 'bg-green-100 text-right' : 'bg-gray-100 text-left'
                }`}
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
