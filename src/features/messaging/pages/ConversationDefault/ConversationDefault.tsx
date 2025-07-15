import Divider from '@mui/material/Divider';
import React from 'react';

const ConversationDefault = () => {
  return (
    <div className="bg-white h-full flex flex-col items-center justify-center p-6">
      {/* Card Container */}
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden border-1 border-gray-200">
        {/* Header */}
        <div className="p-6 rounded-t-lg text-center">
          <h1 className="text-4xl font-semibold">Welcome to Our Platform</h1>
          <p className="mt-2 text-lg">Connect with people and explore new conversations!</p>
        </div>
        <Divider/>
        {/* Main Content */}
        <div className="p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <span className="text-3xl text-blue-600">📩</span>
            </div>
            <h2 className="text-2xl font-medium text-gray-800 mb-4">Start a Conversation</h2>
            <p className="text-gray-600 text-lg">To get started, simply click on any of the contacts below to begin chatting.</p>
          </div>
        </div>
      <Divider/>
        {/* Footer */}
        <div className="p-4 text-center rounded-b-lg">
          <p>&copy; 2025 Our Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default ConversationDefault;
