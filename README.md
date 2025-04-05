
# 🧠 VAIDHYAMITRA - AI-Powered Healthcare Companion

VaidhyaMitra is an AI-powered Progressive Web App (PWA) healthcare chatbot designed to help users with basic medical inquiries, exercise, and nutrition suggestions. It works both online and offline, making it ideal for low-connectivity rural areas.


## 🌐 Live Demo (Online Mode)

🟢 Check it out here: https://vaidhyamitra-front.onrender.com/

💡 Uses the Google Gemini API for AI-based medical conversations.


## ⚙️ Run Locally (Offline Mode)

You can run the app completely offline using local servers and models.

🔧 Prerequisites

Node.js

Python 3.x

📦 Setup Steps

1.Clone the repository

```bash
git clone https://github.com/NaveenGP2005/VAIDHYAMITRA
cd vaidhyamitra

```
2.Start Frontend (React)

```bash
cd frontend
npm install
npm start
```
3.Start Backend (Node.js API)
```bash
cd backend
npm install
node server.js
```
4.Start Offline AI Server (Python)
```bash
cd backend
python api.py
```
🧠 Ensure the GPT4All Falcon model is downloaded and correctly referenced in api.py.

## ✅ Current Features



- Online chatbot using Google Gemini API

- Offline chatbot using GPT4All Falcon (Python API)

- Progressive Web App (PWA) built with React

- Node.js + Express backend API

## 🧪 Upcoming Features
- Voice Input using Whisper AI (planned)

- Offline symptom analysis with improved models

- Multilingual support for regional users

- MongoDB Integration to store user interaction data





## 🛠️ Tech Stack

#### 💻 Frontend
- **React.js** – Progressive Web App (PWA) architecture
- **Tailwind CSS** – Utility-first styling
- **Vite** – Lightning-fast build tool
- **Service Workers** – For offline capabilities

#### 🌐 Backend
- **Node.js + Express.js** – REST API for routing requests
- **Axios** – API requests from frontend to backend

#### 🧠 AI & NLP
- **Google Gemini API** – For online AI responses
- **GPT4All Falcon** – For offline chatbot functionality
- **Python + Flask** – REST API to serve local AI model
- **transformers (HuggingFace)** – *(optional for future)*

#### 📦 DevOps (Planned)
- **Docker** – Containerization of services
- **Kubernetes** – Deployment & orchestration
- **Terraform** – Infrastructure as code

#### 🗃️ Database (Planned)
- **MongoDB** – For storing user chat history and metadata

#### 🗣️ Speech Recognition (Planned)
- **Whisper AI** – For voice input and language translation


## 🚀 Goal
VaidhyaMitra is part of the Google Solution Challenge 2025, targeting SDG Goal 3: Good Health and Well-being. It focuses on empowering rural communities with accessible AI-based healthcare tools.

