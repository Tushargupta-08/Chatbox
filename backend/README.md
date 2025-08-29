AI Mockup Backend

This is the backend service for the AI Mockup
 project.
It provides APIs for handling mockup data, user requests, and integration with the AI Mockup frontend.

The backend is built with Express.js and MongoDB, and deployed on Vercel.

🚀 Features

RESTful API built with Express.js

Database powered by MongoDB

CORS-enabled for frontend communication

Deployed seamlessly on Vercel

Environment variable-based configuration

Production-ready structure

🛠️ Tech Stack

Node.js

Express.js

MongoDB / Mongoose

Vercel

📂 Project Structure
├── src
│   ├── config       # Database & environment configuration
│   ├── controllers  # API request handlers
│   ├── models       # Mongoose schemas
│   ├── routes       # Express routes
│   ├── utils        # Helper functions
│   └── server.js    # App entry point
├── .env.example     # Example environment variables
├── package.json
└── README.md

⚙️ Setup & Installation
1. Clone the repository
git clone https://github.com/yourusername/aimockup-backend.git
cd aimockup-backend

2. Install dependencies
npm install

3. Configure Environment Variables

Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
PORT=5000

4. Run locally
npm run dev


The server will start on http://localhost:5000.

🌐 Deployment on Vercel

Push your project to GitHub.

Import the repo into Vercel
.

Add environment variables in Vercel Project Settings → Environment Variables.

Deploy 🚀

📡 API Endpoints (example)
Method	Endpoint	Description
GET	/api/mockups	Fetch all mockups
POST	/api/mockups	Create a new mockup
GET	/api/mockups/:id	Get mockup by ID
DELETE	/api/mockups/:id	Delete mockup
🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a PR or submit an issue.

📜 License

This project is licensed under the MIT License.
