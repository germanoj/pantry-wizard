# Pantry Wizard 🧙‍♂️

Pantry Wizard is a mobile-first iOS app that helps answer the question:
**"What should I make for dinner?"**

Users enter the ingredients they have on hand and optional preferences to receive structured, AI-generated recipes—reducing food waste and simplifying meal planning.

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
- Render (backend API hosting)

---

## 🧠 How It Works (High-Level Architecture)

1. The Expo-based React Native frontend collects pantry input and meal preferences.
2. The frontend sends a request to the Express API.
3. The backend calls the OpenAI API to generate structured recipe data.
4. Recipes are parsed, stored in PostgreSQL, and optionally associated with images.
5. The frontend renders the results as mobile-friendly recipe cards.

---

## 📚 What I Learned

- Designing and deploying a full-stack application
- Integrating AI APIs into a real user workflow
- Managing environment variables across local and deployed environments
- Structuring backend APIs for mobile clients
- Debugging real-world deployment and networking issues

## 📌 Project Status

Core functionality is complete and the project is considered production-complete for its intended scope.

## 🤝 Team Contributions

This project was built collaboratively as a team capstone. Primary areas of contribution are outlined below.

### Jerrad Germano
- Backend architecture and API development (Node.js, Express)
- PostgreSQL database design and integration
- OpenAI API integration and structured recipe parsing
- Backend deployment and environment configuration (Render)
- API debugging, networking, and deployment troubleshooting
- Frontend–backend integration and API client configuration
- Overall project architecture and technical direction

### Hayley McVicar
- 

### Matt Zaleta
- Shaping of project concept and development direction, collaborating to define scope and priorities
- Mobile-first recipe card components in React Native, optimized for readability, touch interaction, and constrained screen sizes
- Saved Recipes flow, save/remove actions, persistent storage integration, and navigation
- State management for generated vs. saved recipes, ensuring smooth transitions and predictable UI behavior across screens
- Collaboration to align API responses with frontend data models, iterating on schema and UI needs during development
- React Native UI patterns (cards, lists, headers, empty states) ensuring a cohesive, polished iOS experience

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
