const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(mongoURL);
const dbName = 'passop';
const jwtSecret = "yoursecretkey";

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB");
}
connectDB();

const db = client.db(dbName);
const usersCollection = db.collection('users');
const passwordsCollection = db.collection('passwords');

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ name, email, password: hashedPassword });
    const token = jwt.sign({ email }, jwtSecret);
    res.json({ success: true, authtoken: token });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) return res.json({ success: false, error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, error: "Invalid credentials" });
    const token = jwt.sign({ email }, jwtSecret);
    res.json({ success: true, authtoken: token });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Middleware to verify token
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send("Access denied");
  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// Password routes
app.get('/api/passwords/fetch', fetchUser, async (req, res) => {
  const passwords = await passwordsCollection.find({ email: req.user.email }).toArray();
  res.send(passwords);
});

app.post('/api/passwords/add', fetchUser, async (req, res) => {
  const { site, username, password, id } = req.body;
  await passwordsCollection.insertOne({ email: req.user.email, site, username, password, id });
  res.send({ success: true });
});

app.delete('/api/passwords/delete', fetchUser, async (req, res) => {
  const { id } = req.body;
  await passwordsCollection.deleteOne({ email: req.user.email, id });
  res.send({ success: true });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
