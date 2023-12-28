// server.js
const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

// Handle requests to any unknown route by serving the React app
app.get("/api", (req, res) => {
  // res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  res.send("<h1>Hello</h1>");
});

// Add this route to get all users
app.get('/api/get-all-users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Connect to MongoDB (you need to have MongoDB installed and running)
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/mern_email_app",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define a simple mongoose model for user information
const User = mongoose.model("User", {
  name: String,
  email: String,
  jobDescription: String,
});

// Middleware to parse JSON data
app.use(express.json());

// API endpoint to save user information
app.post("/api/save-user", async (req, res) => {
  try {
    const { name, email, jobDescription } = req.body;
    console.log(req.body);

    // Save user information to MongoDB
    const user = new User({ name, email, jobDescription });
    await user.save();

    // Send confirmation email using Node Mailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Confirmation Email",
      text: "Thank you for submitting your information. We have received your response.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res
      .status(200)
      .json({ message: "User information saved and email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
