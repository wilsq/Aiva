Aiva Chatbot - Kouluprojekti
📌 Yleiskuvaus

Aiva on kouluprojekti, jossa rakennetaan full-stack chatbot-sovellus. Chatbot hyödyntää OpenAI API:a tekoälyvastausten tuottamiseen. Frontend on toteutettu Reactilla (Vite) ja backend Node.js + Express + MongoDB (Mongoose) -tekniikoilla. Sovelluksessa käyttäjä voi hakea tuotteita, keskustella chatbotin kanssa ja tarkastella MongoDB-tietokannasta haettua tuotetietoa.

🗂 Projektin kansiorakenne
aiva-chatbot/
├── backend/
│ ├── server.js # Express server + MongoDB connection
│ ├── models/ # Mongoose schemas and models
│ ├── routes/ # API routes (e.g., product routes, chat routes)
│ ├── .env # Environment variables (not in GitHub)
│ └── package.json # Backend dependencies & scripts
├── frontend/
│ ├── src/
│ │ ├── components/ # React components (ChatWindow, ProductSearch...)
│ │ ├── App.jsx # Main frontend app
│ │ └── index.css # Styles
│ └── package.json # Frontend dependencies & scripts
└── README.md

⚙️ Käytetyt teknologiat
Kerros Teknologia
Frontend React (Vite), JavaScript
Backend Node.js, Express.js, CORS, dotenv
Database MongoDB Atlas + Mongoose
AI OpenAI API
Tools Git, Nodemon, npm

Tekijät:
Kauri Haltsonen, Veera Kettunen, Mikael Lönnberg, Viljami Viinikainen
