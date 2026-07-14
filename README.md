
# FCL Project 

A full-stack web application with a decoupled architecture, using **FastAPI (Python)** for data logic and **TypeScript** for the user interface.



 Project Overview & Architecture
* `frontend` (TypeScript):** The visual layer. Captures user actions and sends background network requests.
* `backend` (Python + FastAPI):** The API layer. Receives requests, runs logic, and returns raw JSON data.
* Data Flow:** Frontend `fetch()` FastAPI Endpoint  JSON Response UI Updates instantly.



 Repository Structure

FCL/
├── backend/          # FastAPI server configuration & routing endpoints
└── frontend/         # TypeScript interactive components & UI layouts




Local Launch Guide (Run Both Simultaneously)

 Terminal 1: FastAPI Backend
Go to the backend folder, activate your virtual environment, and boot the API engine:

cd backend
python -m venv venv
source venv/bin/activate  # Windows users: .\venv\Scripts\activate
pip install -r requirements.txt
fastapi dev main.py

API Home:`http://127.0.0.1:8000`
Interactive Swagger Docs: `http://127.0.0`

Terminal 2: TypeScript Frontend
Open a second terminal window, enter the frontend folder, and launch the UI compilation server:

cd frontend
npm install
npm run dev

Local Web App:** `http://localhost:3000`

---

Live Deployment
UI Hosting Node:** Deployed live via Vercel pipelines at [fcl-iota.vercel.app](https://vercel.app).
