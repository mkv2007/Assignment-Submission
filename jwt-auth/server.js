// server.js
const http = require("http");
const url = require("url");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.log("Missing JWT_SECRET in .env file");
  process.exit(1);
}

// in-memory users storage: [{email:"", passwordHash:""}]
const users = [];

function send(res, code, message) {
  res.writeHead(code, { "Content-Type": "text/plain" });
  res.end(message);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  // -----------------------------
  // REGISTER
  // -----------------------------
  if (pathname === "/register") {
    const { email, password } = query;

    if (!email || !password) return send(res, 400, "email and password required");

    const exists = users.find(u => u.email === email);
    if (exists) return send(res, 409, "Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ email, passwordHash });

    return send(res, 200, "Registration successful");
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  if (pathname === "/login") {
    const { email, password } = query;

    if (!email || !password) return send(res, 400, "email and password required");

    const user = users.find(u => u.email === email);
    if (!user) return send(res, 401, "Invalid credentials");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return send(res, 401, "Invalid credentials");

    // create token that expires in 10 minutes
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "10m" });

    return send(res, 200, token);
  }

  // -----------------------------
  // INVOKE (protected route)
  // -----------------------------
  if (pathname === "/invoke") {
    const { token } = query;

    if (!token) return send(res, 401, "Access denied");

    try {
      jwt.verify(token, JWT_SECRET);
      return send(res, 200, "Function invoked successfully");
    } catch (err) {
      return send(res, 401, "Access denied");
    }
  }

  // if unknown route
  send(res, 404, "Route not found");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
