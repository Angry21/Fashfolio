# FashFolio

**FashFolio** is a cutting-edge, AI-powered fashion portfolio and social networking platform. It seamlessly blends a modern e-commerce style catalog with social features, utilizing **Google Gemini AI** to provide intelligent trend analysis, user scoring, and a multi-agent creative team.

## 🚀 Features

*   **Multi-Agent Creative Team**: A dedicated squad of AI agents (Seyna, Vogue, Ledger, Echo) to simulate a real-world fashion house workflow.
*   **AI Trend Analysis**: Automatically analyzes product catalogs to identify fashion trends and generate marketing blurbs using Gemini AI.
*   **AI User Scoring**: sophisticated scoring system to evaluate user engagement and influence within the platform.
*   **Visual-First Design**: A premium, "Instagram-style" masonry layout for showcasing outfits and portfolios.
*   **Secure Authentication**: Integrated with **Clerk** for robust and secure user management.
*   **Image Management**: High-performance image uploads and transformation via **Cloudinary**.
*   **Modern Tech Stack**: Built with a Monorepo structure separating a high-speed Next.js frontend from a flexible Express & Python backend.

## 🤖 AI Agents System (New)

FashFolio features a standalone **Multi-Agent System** powered by Google Gemini, simulating a fashion business board meeting.

| Agent | Role | Focus | File |
| :--- | :--- | :--- | :--- |
| **Seyna** | 👑 Coordinator (CEO) | Orchestrates the team, takes user goals, and compiles final reports. | `backend/agents/seyna.py` |
| **Vogue** | 🎨 Creative Director | Aesthetics, mood boards, color palettes, and seasonal trends. | `backend/agents/vogue.py` |
| **Ledger** | 💰 CFO | Pricing strategies, profit margins, and financial viability. | `backend/agents/ledger.py` |
| **Echo** | 📣 Head of Marketing | Virality, social media hooks (TikTok/Instagram), and hashtags. | `backend/agents/echo.py` |

### Running the Agents
Currently, the agent system runs via CLI. You can hold a strategy meeting by running **Seyna**:

```bash
cd backend
# Run Seyna and pass a goal as JSON
echo '{"goal": "Launch a sustainable denim line for Gen Z"}' | python agents/seyna.py
```

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Next.js 16 (React 19)
*   **Styling**: Tailwind CSS 4
*   **UI Components**: Shadcn/UI (Radix Primitives)
*   **State/Data Fetching**: SWR, Axios
*   **Auth**: Clerk
*   **Media**: Cloudinary

### Backend
*   **Server**: Node.js + Express
*   **Database**: MongoDB (Mongoose)
*   **AI Engine**: Python (Google Generative AI SDK)
*   **Environment**: Dotenv for configuration

## 📂 Project Structure

The project is organized as a monorepo:

```
fashfolio-app/
├── backend/
│   ├── agents/             # Multi-Agent System (Seyna, Vogue, Ledger, Echo)
│   ├── models/             # Mongoose Schemas (Product, User)
│   ├── ai_trend.py         # AI Script for Trend Analysis
│   ├── ai_scoring.py       # AI Script for User Scoring
│   ├── server.js           # Main Entry Point
│   └── requirements.txt    # Python Dependencies
├── frontend/               # Next.js Application
│   ├── app/                # App Router Pages & Layouts
│   ├── components/         # Reusable UI Components
│   └── lib/                # Utilities & Helpers
└── package.json            # Root configuration
```

## ⚡ Getting Started

### Prerequisites
*   **Node.js** (v18+)
*   **Python** (v3.8+)
*   **MongoDB** (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/fashfolio-app.git
cd fashfolio-app
```

### 2. Setup Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
PYTHON_COMMAND=python   # or python3 depending on your system
```

### 3. Setup Frontend
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env.local` file in `frontend/` with your Clerk and Cloudinary keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## 🏃‍♂️ Running the App

You can run the backend and frontend independently using the root scripts or individual directories.

**From the Root:**

1.  **Start Backend**:
    ```bash
    npm run dev:backend
    ```
2.  **Start Frontend** (in a new terminal):
    ```bash
    npm run dev:frontend
    ```

**Access the App:**
*   Frontend: `http://localhost:3000`
*   Backend API: `http://localhost:5000`

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products |
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/analyze-trends` | **AI**: Trigger trend analysis on products |
| `POST` | `/api/score-users` | **AI**: Calculate user influence scores |

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
