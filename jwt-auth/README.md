
# JWT Auth (Node.js)

A simple JWT-based authentication system built using **pure Node.js** (`http`, `url`) along with `bcrypt`, `jsonwebtoken`, and `dotenv`.  
It allows users to register, log in to receive a JWT, and access a protected route.

---

## 📌 Features

- Register a new user  
- Hash passwords securely using **bcrypt**  
- Login and receive a **JWT token**  
- Protected `/invoke` route that validates JWT  
- JWT expires in **10 minutes**  
- Uses **only Node.js core modules** (no Express)  
- Stores user data in an in-memory array  

---


---

## ⚙️ Installation

Install dependencies:

npm install bcrypt jsonwebtoken dotenv

node server.js

##Process

-http://localhost:3000/register?email=test@gmail.com&password=123

open this link and register 


Expected responce : Registration Successful (or) Email already registered

-http://localhost:3000/login?email=test@gmail.com&password=123

Login into this link then you will be given a JWT token copy that
Expected response : (Returns a unique JWT token)

-http://localhost:3000/invoke?token=PASTE_YOUR_TOKEN_HERE

Paste the JWT token in the place of PASTE_YOUR_TOKEN_HERE in the above link
Expected Response : Function Invoked Successfully (or) Access Denied
