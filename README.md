# 🧠 THE Backend (by Devansh)

**THE Backend** (`dbackend`) is a modular, ready-to-use backend toolkit that simplifies user authentication, email handling, middleware management, and MongoDB integration. Designed for rapid backend development with clean structure and extensibility in mind.

---

## 🚀 Installation

```bash
npm install dbackend
```

---

## 📦 Features

- ✅ MongoDB connection with Mongoose  
- ✅ Authentication system (Signup, Signin, JWT, Email Verification, Password Reset)  
- ✅ Built-in JWT middleware  
- ✅ Mailer integration using Nodemailer  
- ✅ Plug-and-play Express middlewares (CORS, JSON, URL Encoded)  

---

## 🛠️ Usage

### 1. Setup

```js
const express = require("express");
const backend = require("dbackend"); // THE Backend
const User = require("./models/User"); // Define your Mongoose User model
```

### 2. Connect to MongoDB

```js
backend.mongodb({
  url: "mongodb://localhost:27017/mydb",
});
```

### 3. Setup Mailer (Optional)

```js
const mailer = backend.mailer({
  service: "Gmail",
  auth: {
    user: "your@gmail.com",
    pass: "yourpassword",
  },
});

await mailer.sendMail({
  to: "recipient@example.com",
  subject: "Welcome!",
  text: "Thank you for signing up!",
  html: "<h1>Thank you for signing up!</h1>",
});
```

### 4. Setup Authentication

```js
const auth = backend.auth({
  jwtSecret: "your_jwt_secret",
  UserModel: User,
  mailer: mailer, // Optional
});
```

### 5. Use Middleware

```js
const app = express();

backend.middlewares(app, ["json", "urlencoded", "cors"]);
```

---

## 🔐 Auth API Example

```js
// Sign Up
await auth.signup({
  email: "user@example.com",
  password: "123456",
  name: "Dev User",
});

// Sign In
const result = await auth.signin({
  email: "user@example.com",
  password: "123456",
});

console.log(result.token); // JWT Token

// Middleware Example (Protect Routes)
app.get("/dashboard", auth.middleware(), (req, res) => {
  res.send(`Welcome ${req.user.email}`);
});
```

---

## 📧 Forgot & Reset Password

```js
await auth.forgotPassword("user@example.com");

// Then on /reset-password route
await auth.resetPassword(tokenFromEmail, "newPassword123");
```

---

## 📁 Folder Structure (Example)

```
your-app/
│
├── models/
│   └── User.js
├── server.js
└── ...
```

---

## 🙌 Credits

Developed with ❤️ by **Devansh(CodeReb00t)**

Feel free to contribute, report issues, or suggest features!
