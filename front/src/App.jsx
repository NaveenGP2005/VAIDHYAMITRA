import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Activity,
  FileText,
  Wifi,
  WifiOff,
  Send,
  Menu,
  Upload,
  FolderOpen,
  Search,
  AlertCircle,
  Heart,
  Stethoscope,
  BookOpen,
  Mic,
  MicOff,
  Phone,
  Apple,
  Leaf,
  UploadCloud,
} from "lucide-react";
import axios from "axios";
import nutritionData from "./nutrition.json";
const apiKey = import.meta.env.VITE_PINATA_API_KEY;
const secretKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;

function App() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI health assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRecording, setIsRecording] = useState(false);
  const [vitals, setVitals] = useState({
    heartRate: "72",
    bloodPressure: "120/80",
    oxygenLevel: "98",
  });
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedCategory, setSelectedCategory] = useState("A");
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const recognition = useRef(null);

  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  useEffect(() => {
    const storedFiles = localStorage.getItem("uploadedFiles");
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      const uploadedFile = { name: file.name, url: fileUrl };

      setUploadedFiles((prev) => {
        const updated = [...prev, uploadedFile];
        localStorage.setItem("uploadedFiles", JSON.stringify(updated));
        return updated;
      });

      setFile(null);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload");
    }
  };

  const commonSymptoms = {
    A: [
      {
        name: "Abdominal aortic aneurysm (AAA)",
        details:
          "A swelling in the aorta that can be life-threatening if it bursts.",
      },
      { name: "Abortion", details: "A medical procedure to end a pregnancy." },
      {
        name: "Amniocentesis",
        details: "A test to analyze amniotic fluid for genetic disorders.",
      },
      {
        name: "Anaesthesia",
        details:
          "A drug-induced loss of sensation or consciousness used in surgery.",
      },
      {
        name: "Antibiotics",
        details: "Medicines used to treat bacterial infections.",
      },
    ],
    B: [
      {
        name: "Barium enema",
        details: "A diagnostic test to detect abnormalities in the colon.",
      },
      {
        name: "Beta-blockers",
        details:
          "Drugs that reduce blood pressure by blocking adrenaline effects.",
      },
      {
        name: "Biopsy",
        details: "A procedure to remove tissue for examination.",
      },
      {
        name: "Blood tests",
        details:
          "Tests that analyze a sample of your blood for various conditions.",
      },
      {
        name: "Blood transfusion",
        details:
          "The process of transferring blood into a person's circulation.",
      },
    ],
    C: [
      {
        name: "Caesarean section",
        details: "A surgical procedure to deliver a baby through the abdomen.",
      },
      {
        name: "Chemotherapy",
        details: "A treatment that uses drugs to kill cancer cells.",
      },
      {
        name: "Colposcopy",
        details:
          "A procedure to closely examine the cervix for signs of disease.",
      },
      { name: "Contraception", details: "Methods used to prevent pregnancy." },
      {
        name: "CT scan",
        details:
          "A detailed imaging technique using X-rays to view inside the body.",
      },
    ],
  };

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";

      recognition.current.onstart = () => setIsRecording(true);
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
        handleSendMessage(null, transcript);
      };
      recognition.current.onerror = () => setIsRecording(false);
      recognition.current.onend = () => setIsRecording(false);
    }

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
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
      }
    }
  };

  const stopRecording = () => {
    if (recognition.current && isRecording) {
      recognition.current.stop();
    }
  };

  const handleSendMessage = async (e, voiceMessage = null) => {
    if (e) e.preventDefault();

    const messageText = voiceMessage || inputMessage;
    if (!messageText.trim()) return;

    const newMessage = {
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    try {
      const baseURL =
        window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "https://vaidhyamitra-backend.onrender.com";

      const response = await axios.post(
        `https://vaidhyamitra-backend.onrender.com/api/chatbot`, // Use backticks here
        { message: messageText },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const aiResponse = {
        text: response.data.reply || "No response from AI",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting response:", error);

      const errorResponse = {
        text: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const renderNutritionInfo = () => {
    if (!selectedNutrient) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {nutritionData.nutrition_dataset.map((nutrient) => (
            <div
              key={nutrient.nutrient}
              onClick={() => setSelectedNutrient(nutrient)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {nutrient.nutrient === "Vitamin C" ? (
                  <Apple className="h-6 w-6 text-green-500" />
                ) : nutrient.nutrient === "Calcium" ? (
                  <Activity className="h-6 w-6 text-blue-500" />
                ) : (
                  <Leaf className="h-6 w-6 text-red-500" />
                )}
                <h3 className="text-lg font-semibold">{nutrient.nutrient}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Click to see food sources rich in {nutrient.nutrient}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedNutrient(null)}
          className="mb-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <span>← Back to nutrients</span>
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Foods Rich in {selectedNutrient.nutrient}
        </h2>

        {selectedNutrient.food_groups.map((group) => (
          <div key={group.category} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">
              {group.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.foods.map((food) => (
                <div
                  key={food.name}
                  className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                >
                  <span>{food.name}</span>
                  <span className="font-semibold text-blue-600">
                    {food.content_mg_per_100g} mg/100g
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000&q=80"
          alt="Healthcare"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">
                V<span className="text-red-300">AI</span>DHYAMITRA
              </h1>
            </div>
            <p className="text-xl">Your Offline-First Healthcare Companion</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                V<span className="text-red-300">AI</span>DHYAMITRA
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {true ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Wifi className="h-5 w-5" />
                  <span className="text-sm font-medium">Online Mode</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-600">
                  <WifiOff className="h-5 w-5" />
                  <span className="text-sm font-medium">Offline Mode</span>
                </div>
              )}

              <a
                href="tel:112"
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-red-700 transition"
              >
                <Phone className="h-5 w-5" />
                <span>Emergency</span>
              </a>

              <Menu className="h-6 w-6 text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interface */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md h-[700px] flex flex-col">
            <div className="p-4 border-b">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "chat"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>AI Assistant</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("symptoms")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "symptoms"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Common Symptoms</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("nutrition")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "nutrition"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Apple className="h-5 w-5" />
                    <span>Nutrition</span>
                  </div>
                </button>
              </div>
            </div>

            {activeTab === "chat" ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      } fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 message-transition ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Describe your symptoms or ask a health question..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isRecording
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="h-5 w-5 text-white" />
                      ) : (
                        <Mic className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : activeTab === "symptoms" ? (
              <div className="flex-1 overflow-y-auto p-4">
                {!selectedSymptom ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.keys(commonSymptoms).map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`p-3 rounded-lg transition-colors ${
                            selectedCategory === category
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {selectedCategory && (
                      <div className="space-y-2">
                        {commonSymptoms[selectedCategory].map(
                          (symptom, index) => (
                            <div
                              key={index}
                              onClick={() => setSelectedSymptom(symptom)}
                              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                              {symptom.name}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <button
                      onClick={() => setSelectedSymptom(null)}
                      className="mb-4 p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      ← Back
                    </button>
                    <h2 className="text-xl font-semibold">
                      {selectedSymptom.name}
                    </h2>
                    <p className="mt-2">{selectedSymptom.details}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                {renderNutritionInfo()}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Vitals Monitor */}
            <div className="bg-white rounded-xl shadow-md p-6 vitals-card">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Real-time Vitals</h2>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {vitals.heartRate} BPM
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {vitals.bloodPressure} mmHg
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Oxygen Level</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {vitals.oxygenLevel}%
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Records */}
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">
                  Medical Records Upload
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 hover:bg-blue-50 cursor-pointer transition duration-200">
                  <UploadCloud className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-gray-700">
                    {file ? file.name : "Click to select a file"}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Upload to IPFS
                </button>
              </form>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">
                  📁 Uploaded Files
                </h3>
                {uploadedFiles.length === 0 ? (
                  <p className="text-gray-500">No files uploaded yet.</p>
                ) : (
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
