🌐 Modern API Testing & Comparison Tool

A sleek and professional React + FastAPI web application that allows users to test and compare multiple APIs side by side.
This project is built with a modern dark-themed UI, equal spacing optimization, and integrated voice-over functionality to make API responses accessible and interactive.

✨ Features

🔑 API Key Input – Securely test APIs with your own keys.
📩 Prompt Input – Send prompts to different API models and compare outputs.
⚡ Real-time Comparison – View response times, statuses, and results in structured cards.
🎤 Voice-over Support – Converts API text responses into natural speech (without pyttsx3).
🎨 Modern UI – Dark theme, glowing headers, professional spacing, and responsive design.
⏳ Loader Animation – Elegant spinner while waiting for API responses.
📱 Responsive Layout – Works seamlessly on desktop and mobile.

🛠️ Tech Stack

Frontend (React)
⚛️ React.js – Component-based frontend framework.
🎨 CSS3 – Custom styling with gradients, shadows, and animations.
🌀 Flexbox & Responsive Design – Optimized for all screen sizes.

Backend (FastAPI)
⚡ FastAPI – High-performance backend framework.
🔊 gTTS (Google Text-to-Speech) – Voice-over generation.
📦 Uvicorn – ASGI server for FastAPI.

Other Tools
🖥️ VS Code – Development environment.
🐙 GitHub – Version control and project hosting.
🌍 CORS Middleware – Cross-origin support for frontend-backend integration.

🚀 Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/your-username/api-testing-tool.git
cd api-testing-tool

2️⃣ Backend Setup (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

3️⃣ Frontend Setup (React)
cd frontend
npm install
npm start


Now, open http://localhost:3000
 for the frontend and http://localhost:8000
 for the backend.



📊 Project Structure
api-testing-tool/
│
├── backend/               # FastAPI backend
│   ├── main.py             # FastAPI app
│   ├── requirements.txt    # Backend dependencies
│   └── tmp/                # Temporary audio files
│
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.js          # Main app logic
│   │   ├── index.css       # Global styles
│   │   └── components/     # UI components
│   ├── package.json        # Frontend dependencies
│   └── public/
│
└── README.md              # Project documentation



📜 License

This project is licensed under the MIT License – free to use, modify, and distribute.

🔥 With this project, developers, students, and educators can test and compare APIs faster, smarter, and with style!
