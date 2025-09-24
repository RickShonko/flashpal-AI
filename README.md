# Flashpal Backend

Flashpal is a smart learning assistant that helps students retain knowledge using **AI-powered spaced repetition** and **flashcards**.  
It is designed as part of the TVET Innovation Competition under the **Cross-Cutting Issues** theme — focusing on digital transformation, inclusivity, and mental health support in education.

---

## 🚀 Features
- User profiles with authentication
- Subscription plans & payments (Paystack integration)
- Flashcard deck creation & management
- Intelligent study sessions (difficulty tracking & spaced repetition)
- REST API for frontend integration

---

## 📂 Project Structure
flashpal-backend/
│── index.js # Entry point
│── db.js # Database connection
│── routes/ # API route handlers
│ ├── profiles.js
│ ├── subscriptions.js
│ ├── payments.js
│ └── flashcards.js
│── schema.sql # PostgreSQL schema
│── package.json
│── README.md

yaml
Copy code

---

## 🛠️ Tech Stack
- **Backend Framework:** Node.js + Express  
- **Database:** PostgreSQL  
- **ORM/Query Tool:** pg (node-postgres)  
- **Authentication:** JWT (to be added)  
- **Payments:** Paystack API  

---

## 📦 Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/flashpal-backend.git
   cd flashpal-backend
Install dependencies:

```bash
npm install
```
Configure environment variables:

Create a .env file in the root directory:

```bash
env
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/flashpal
PORT=5000
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```
Run database schema:

```bash
psql -U postgres -d flashpal -f schema.sql
Start development server:
```

```bash
npm run dev
```
📌 API Endpoints

Profiles

POST /profiles/login → Create/login a profile

GET /profiles/:id → Fetch user profile

Flashcards

POST /flashcards → Add flashcard

GET /flashcards/:deckId → Fetch flashcards in a deck

Subscriptions
POST /subscriptions → Subscribe to a plan

GET /subscriptions/:userId → Get user subscription

Payments

POST /payments/initiate → Start Paystack payment

GET /payments/:userId → Get user payments

📖 Thematic Justification
Flashpal addresses Cross-Cutting Issues in TVET innovation by:

Enhancing digital literacy through modern AI-powered learning tools.

Supporting inclusive learning for students with different learning needs.

Reducing exam stress and improving mental well-being.

Empowering youth with skills that strengthen all thematic areas (manufacturing, health, food security, housing, and greening).

👥 Contributors
Ricky Shonko (Lead Developer)


📜 License
MIT License.

