# Pantry Wizard 🧙‍♂️

Pantry Wizard is an iOS mobile app that helps answer the question:
**"What should I make for dinner?"**

Pantry Wizard is a mobile-first, AI-powered recipe generator that helps users create meal ideas based on the ingredients they already have. By entering pantry items and optional preferences, users receive structured, AI-generated recipes designed to reduce food waste and simplify meal planning.

This project was built as a full-stack capstone application, with a deployed backend, real AI integration, and a React Native mobile frontend.

---

## 🚀 Features

- Generate recipes from free-text pantry input
- Optional meal-type filtering (breakfast, lunch, dinner, snack, dessert)
- AI-generated, structured recipe responses
- Recipe cards optimized for mobile viewing
- Save generated recipes for later
- Deployed backend API
- Mobile-first user experience using React Native

---

## 🛠 Tech Stack

**Frontend**
- React Native (Expo)
- TypeScript
- Expo Router

**Backend**
- Node.js
- Express
- PostgreSQL

**AI & Media**
- OpenAI API (recipe generation)
- Cloudinary (image handling)

**Deployment**
- Render (backend/frontend hosting)

---

## 🧠 How It Works (High-Level Architecture)

1. The Expo-based React Native frontend collects pantry input and meal preferences.
2. The frontend sends a request to the Express API.
3. The backend calls the OpenAI API to generate structured recipe data.
4. Recipes are parsed, stored in PostgreSQL, and optionally associated with images.
5. The frontend renders the results as mobile-friendly recipe cards.

---

## ⚙️ Running the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- Expo CLI

### Installation

```bash
git clone https://github.com/your-username/pantry-wizard.git
cd pantry-wizard
npm install
