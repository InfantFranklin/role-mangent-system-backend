const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const organizationRoutes = require("./routes/organizationRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

// Enable CORS for all origins
app.use(cors());
// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// sample API
app.get("/", async (req, res) => {
  res.send("Welcome to Role Management System!!");
});

// Define Routes
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);

const HOST = process.env.Host || "localhost";
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on port http://${HOST}:${PORT}/`)
);
