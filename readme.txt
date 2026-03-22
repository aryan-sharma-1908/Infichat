# InfiChat 💬

A **real-time chat application** built using the **MERN stack** that enables instant messaging between users with secure authentication and low-latency communication.

## 🚀 Features

* ⚡ **Real-time messaging** using WebSockets with Socket.io
* 🔐 **Secure authentication** with JWT and protected routes
* 💬 Instant **bidirectional communication** between users
* 🗄 **MongoDB database** for persistent message storage
* 🎨 **Responsive UI** built with React
* 🔄 Dynamic chat updates without page refresh
* 🧠 Scalable backend architecture with Node.js and Express

## 🛠 Tech Stack

**Frontend**

* React
* JavaScript (ES6+)
* CSS

**Backend**

* Node.js
* Express.js
* Socket.io

**Database**

* MongoDB
* Mongoose

**Authentication**

* JSON Web Tokens (JWT)

## 📂 Project Structure

```
Infichat
│
├── frontend
│   ├── src
│   ├── components
│   └── pages
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   └── socket
│
└── README.md
```

# Project setup instructions:

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/aryan-sharma-1908/Infichat.git
cd Infichat
```

### 2️⃣ Install dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the application

Backend

```bash
npm run dev
```

Frontend

```bash
npm start
```

The app should now run on:

```
http://localhost:3000
```

## 📸 Future Improvements

* Typing indicators
* Online/offline user status
* Message notifications
* Media/file sharing
* Group chat support

## 🤝 Contributing

Contributions are welcome!
Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, consider **starring the repository**!
