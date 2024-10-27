// src/components/chatbot/chatbox.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Maximize2, Minimize2 } from 'lucide-react';
import earlyCareerData from '../../data/early_career.json';
import middleCareerData from '../../data/middle_career.json';
import lateCareerData from '../../data/late_career.json';

const Chatbox = ({ careerStage, toggleChatbox }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [careerData, setCareerData] = useState(earlyCareerData);

  useEffect(() => {
    if (toggleChatbox) {
      setIsOpen(true);
      setIsMaximized(true);
    }
  }, [toggleChatbox]);

  useEffect(() => {
    switch (careerStage) {
      case 'early':
        setCareerData(earlyCareerData);
        break;
      case 'middle':
        setCareerData(middleCareerData);
        break;
      case 'late':
        setCareerData(lateCareerData);
        break;
      default:
        setCareerData(earlyCareerData);
    }
  }, [careerStage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    const assistantPrompt = `You are a helpful assistant specializing in ${careerStage} career financial planning. Here is relevant data: ${JSON.stringify(careerData)}`;

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
          <MessageSquare className="h-8 w-8 text-white" />
        </button>
      )}
      {isOpen && (
        <div
          className={`${
            isMaximized ? 'w-96 h-[32rem]' : 'w-80 h-96'
          } bg-white rounded-lg shadow-lg flex flex-col fixed bottom-5 right-5 z-50 transition-all duration-200`}
        >
          <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">FinTeach Assistant</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-white text-lg font-bold hover:text-gray-200"
              >
                {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white text-xl font-bold hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-2`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-green-100 text-right'
                      : 'bg-gray-100 text-left'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
