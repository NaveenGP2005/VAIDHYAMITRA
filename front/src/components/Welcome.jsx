import React from "react";

const Welcome = () => {
  return (
    <div className="bg-blue-500 text-white py-4 px-6 text-center rounded-md shadow-md">
      <h1 className="text-xl font-semibold">
        Welcome to{" "}
        <span className="text-yellow-300">Healthcare AI Chatbot</span>
      </h1>
      <p className="text-sm opacity-80">
        Your personal AI-powered health assistant.
      </p>
    </div>
  );
};

export default Welcome;
