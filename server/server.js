const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const data = require("./data");
const multer = require("multer");
require('dotenv').config();

const app = express();
const upload = multer();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.error("MongoDB Atlas connection error:", err));

// Mongoose schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    profession: String,
    companyName: String,
    address: String,
    country: String,
    state: String,
    city: String,
    subscriptionPlan: String,
    newsletter: Boolean,
});
const User = mongoose.model("User", userSchema);

// Endpoints
app.post('/api/user/submit', upload.none(), async (req, res) => {
    try {
        const userData = req.body;
        userData.newsletter = userData.newsletter === 'true'; // convert string to boolean
        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json({ message: "Data saved to MongoDB" });
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/user/check-username', async (req, res) => {
    const username = req.query.username?.toLowerCase();
    if (!username || username.length < 4 || username.length > 20 || /\s/.test(username)) {
        return res.status(400).json({ available: false, message: 'Invalid username format' });
    }
    const userExists = await User.findOne({ username });
    res.json({ available: !userExists });
});

app.get("/api/user/countries", (req, res) => {
    res.json(Object.keys(data));
});

app.get("/api/user/states/:country", (req, res) => {
    const country = req.params.country;
    const states = Object.keys(data[country] || {});
    res.json(states);
});

app.get("/api/user/cities/:state", (req, res) => {
    const { country } = req.query;
    const stateData = data[country]?.[req.params.state];
    res.json(stateData || []);
});

app.listen(port, () => {
    console.log("Server running.");
});
