# Chatbox-Rust

A full-stack **AI Chatbot** application with:
- **Frontend**:React.js (deployed on Vercel)
- **Backend**: Node.js + Express + MongoDB (deployed on Render)

It provides a modern chat UI with persistent history, authentication-ready setup, and real-time AI responses streamed from the backend.

---

## 🚀 Features

### Frontend
- Built with **React.js (App Router)**
- Styled using **Tailwind CSS** + **shadcn/ui**
- Real-time message streaming from backend
- Sidebar with multiple conversations
- Mobile responsive

### Backend
- **Express.js** server
- **MongoDB** (Mongoose models for User & Chats)
- **JWT authentication** (ready for protected routes)
- **OpenAI API integration** (streaming responses)
- Deployed on **Render**

---

## 🌐 Live Demo

- **Frontend (Vercel)** → [chatbox-rust.vercel.app](https://chatbox-rust.vercel.app/)  
- **Backend (Render)** → `https://chatbox-08oa.onrender.com'
---

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, shadcn/ui, Framer Motion  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, OpenAI SDK  
- **Deployment**: Vercel (frontend) + Render (backend)  

---

## ⚡ Quick Start (Local Development)

### 1. Clone Repos
```bash
# Frontend
git clone <your-frontend-repo-url>
cd frontend
npm install

# Backend
git clone <your-backend-repo-url>
cd backend
npm install
