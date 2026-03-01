# Smart Error Tracker
A lightweight, AI-powered runtime error monitoring and diagnostics tool. 
Smart Error Tracker captures unhandled exceptions in your applications via a custom SDK, stores them centrally, and utilizes Google's Gemini 2.5 Flash model to provide automated root-cause analysis and actionable solutions.

## 🚀 Features
* **Custom Tracking SDK:** A plug-and-play script (`smart-tracker.js`) to capture client-side (`window.onerror`) and server-side (`uncaughtException`) errors seamlessly.
* **AI-Powered Diagnostics:** Automated error analysis generating localized, context-aware troubleshooting steps via Gemini 2.5 Flash.
* **Real-time Issue Management:** A minimalist, developer-focused dashboard to monitor error frequencies, timestamps, and toggle resolution states (Open/Resolved).
* **Data Deduplication:** Unique fingerprinting mechanism to prevent database bloat from recurring identical errors.

## 🛠️ Tech Stack
* **Frontend / Framework:** Next.js (App Router), React
* **Styling:** Tailwind CSS, Lucide React
* **Database / Backend-as-a-Service:** Supabase (PostgreSQL)
* **AI Integration:** Google Generative AI SDK (Gemini 2.5 Flash)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/pakayca/smart-error-tracker.git](https://github.com/pakayca/smart-error-tracker.git)
   cd smart-error-tracker

3. **Install dependencies:**
   ```bash
   npm install

4.  **Environment Variables:**
  Create a .env.local file in the root directory and add your keys. Never commit this file.

  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  GEMINI_API_KEY=your_gemini_api_key

4.  **Database Setup (Supabase):**
* **Execute the following SQL command in your Supabase SQL Editor to create the required table:**

 ```bash
CREATE TABLE error_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT UNIQUE NOT NULL,
  message TEXT NOT NULL,
  ai_suggestion TEXT,
  count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

5.  **Run the development server:**
  ```bash
  npm run dev

6.  **Open:**
   http://localhost:3000 to view the dashboard.

## 🔌 SDK Integration Usage
*  **To monitor errors in any Next.js/React application, initialize the tracker at the root layout or main entry point of your project:**

 ```bash
import SmartTracker from './lib/smart-tracker';

// Initialize with your API endpoint
SmartTracker.init('/api/report');

 * **Once initialized, any unhandled runtime error will be automatically caught, sent to the API, analyzed by the AI, and displayed on the dashboard.**
