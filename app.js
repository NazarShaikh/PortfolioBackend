const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000; // Local port
const MONGO_URI = "mongodb://127.0.0.1:27017/contact-form"; // Local MongoDB

// Allow requests from any local frontend (no deployed link needed)
app.use(cors());
app.use(express.json());

// Connect to Local MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Schema & Model
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", ContactSchema);

// Test Route
app.get("/", (_req, res) => res.send("Portfolio backend is running locally!"));

// POST /contact
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    await new Contact({ name, email, message }).save();
    res.status(200).json({ message: "Message received!" });
  } catch (err) {
    console.error("POST /contact error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
