# Flashpal 💡  
An AI-powered study buddy that helps students create, review, and master concepts through smart flashcards, personalized learning sessions, and progress tracking.  

---

## 🚀 Project Overview  
Flashpal is a web app built to help students overcome common challenges in learning such as:  
- Lack of personalized revision tools  
- Poor knowledge retention with traditional study methods  
- Limited access to adaptive study companions  

The app uses **AI and flashcards** to create a smart, engaging, and interactive study experience.  

---

## 🖼️ Demo  
👉 [Live App on Vercel](https://your-vercel-link-here)  

---

## ✨ Features  
- 👤 **User Profiles** – Sign up, log in, and manage your study profile.  
- 🧠 **Flashcards** – Create decks, add flashcards, and practice recall.  
- ⏳ **Spaced Repetition** – Smart scheduling of study sessions.  
- 📊 **Progress Tracking** – Track performance and review history.  
- 💳 **Subscriptions** – (Coming Soon) Payment integration with Paystack.  

---

## 🛠️ Tech Stack  
### Frontend  
- [Vite](https://vitejs.dev/)
  
- [React](https://react.dev/)
  
- [TypeScript](https://www.typescriptlang.org/)
 
- [Tailwind CSS](https://tailwindcss.com/)
   
- [shadcn/ui](https://ui.shadcn.com/)  

### Backend  
- [Node.js](https://nodejs.org/)
  
- [Express.js](https://expressjs.com/)
  
- [PostgreSQL](https://www.postgresql.org/)  

### Deployment  
- [Vercel](https://vercel.com/) – Frontend hosting
  
- [Render / Railway / Supabase (migration ongoing)] – Backend & Database hosting  

---

## 📂 Project Structure  
flashpal/
│
├── flashpal-frontend/ # React + Vite frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
├── flashpal-backend/ # Node.js + Express backend
│ ├── index.js
│ ├── schema.sql
│ └── package.json
│
└── README.md



---

## ⚙️ Installation & Setup  

### Clone Repository  
```bash
git clone https://github.com/RickShonko/flashpal-AI.git
cd flashpal-AI
```
Frontend Setup
```bash
cd flashpal-frontend
npm install
npm run dev
```
Backend Setup
``bash
cd flashpal-backend
npm install
npm run dev
```

Database Setup (PostgreSQL)

Create a database:
```b
CREATE DATABASE flashpal;
Run schema:

sql
\i schema.sql
🔑 Environment Variables
Create a .env file in both frontend and backend.

Frontend .env
ini
VITE_API_URL=http://localhost:5000
Backend .env
ini
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/flashpal
PORT=5000
⚠️ Don’t forget to add .env to .gitignore.

📊 Database Schema
Flashpal includes:

profiles – User profiles

subscription_plans – Plans and pricing

subscriptions – User subscriptions

payments – Payment records

flashcard_decks – Flashcard collections

flashcards – Individual cards

study_sessions – Study history

👥 Contributors
Ricky Shonko – Frontend & Project Lead

Collaborator(s) – Backend & Database

🙏 Acknowledgements
This project was built as part of training under Power Learn Project (PLP).
We appreciate their guidance and support in empowering us to build impactful tech solutions.

📌 Roadmap
 Core flashcard system

 User authentication

 Database schema setup

 Deployment on Vercel

 Payment integration (Paystack)

 Mobile responsive optimization

 AI-powered flashcard generation

📜 License
This project is licensed under the MIT License.
