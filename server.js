const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Path to users file
const usersFile = path.join(__dirname, 'users.json');

// Helper to read users
function readUsers() {
  if (!fs.existsSync(usersFile)) {
    return {};
  }
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

// Helper to write users
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Sign up route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = readUsers();
  if (users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }

  users[email] = { name, email, password };
  writeUsers(users);

  res.json({ message: 'Sign up successful' });
});

// Login route (optional, but added for completeness)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});