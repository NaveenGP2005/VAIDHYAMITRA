import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Make sure to create this file with the CSS below

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = input;
    setInput("");

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        prompt: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: res.data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          V<span className="highlight-ai">AI</span>DHYAMITRA
        </h1>
        <p className="app-subtitle">Your Health Companion</p>
      </header>

      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="ai-icon">
              <span>AI</span>
            </div>
            <p>
              Welcome to VAIDHY<span className="highlight-ai">AI</span>MITRA.
              Ask any health-related questions to get started.
            </p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-wrapper ${
                  msg.type === "user" ? "user-message" : "bot-message"
                }`}
              >
                <div
                  className={`message ${
                    msg.type === "user"
                      ? "user"
                      : msg.type === "error"
                      ? "error"
                      : "bot"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper bot-message">
                <div className="message bot loading">
                  <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your health question..."
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`send-button ${
              isLoading || !input.trim() ? "disabled" : ""
            }`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
