import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef(null); // Ref for speech recognition object

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false; // Capture one utterance
    recognition.current.interimResults = false; // Get final results only
    recognition.current.lang = "en-US";

    recognition.current.onstart = () => {
      setIsRecording(true);
    };

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsRecording(false);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setResponse("Error converting speech to text.");
      setIsRecording(false);
    };

    recognition.current.onend = () => {
      setIsRecording(false);
    };

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognition.current) {
      try {
        recognition.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setResponse("Error starting speech recognition.");
        setIsRecording(false);
      }
    } else {
      alert("Speech recognition not initialized.");
    }
  };

  const stopRecording = () => {
    if (recognition.current && isRecording) {
      recognition.current.stop();
      setIsRecording(false); // Ensure it is set to false
    }
  };

  const sendMessage = async (msg = message) => {
    // Allow passing message
    try {
      const res = await axios.post("http://localhost:5000/api/chatbot", {
        message: msg, // Use passed message or current message state
      });
      setResponse(res.data.reply);
    } catch (error) {
      setResponse("Error getting response");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Healthcare Chatbot
        </h2>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => sendMessage()}
              className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Send
            </button>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-1/2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all ${
                isRecording ? "bg-red-700" : ""
              }`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
          {response && (
            <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <strong className="text-gray-700">Response:</strong> {response}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
