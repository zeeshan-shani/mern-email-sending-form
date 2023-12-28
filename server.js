// server.js
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");

// Load environment variables from .env file
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();

// Enable CORS to allow cross-origin requests
app.use(cors());

// Serve a simple HTML response for the /api route
app.get("/api", (req, res) => {
  res.send("<h4>Api Working Fine...</h4>");
});

// API route to get all users
app.get("/api/get-all-users", async (req, res) => {
  try {
    // Retrieve all users from the MongoDB database
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
  selectedDate: Date,
});

// Middleware to parse incoming JSON data
app.use(express.json());

// API endpoint to save user information
app.post("/api/save-user", async (req, res) => {
  try {
    // Extract user information from the request body
    const { name, email, jobDescription, selectedDate } = req.body;

    // Save user information to MongoDB
    const user = new User({ name, email, jobDescription, selectedDate });
    await user.save();

    // Send a confirmation email using Node Mailer
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

    // Send a JSON response indicating success
    res
      .status(200)
      .json({ message: "User information saved and email sent successfully." });
  } catch (error) {
    console.error(error);
    // Send a JSON response indicating an internal server error
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add this route to delete a user by ID
app.delete("/api/delete-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for admin login
app.post("/api/admin-login", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if admin's name and email exist in the database
    const admin = await User.findOne({ name, email });

    if (admin) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
