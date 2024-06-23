// migrations/migrate.js
const connectDB = require("../config/db");
const Organization = require("../models/Organization");
const User = require("../models/User");
const Role = require("../models/Role");

const migrate = async () => {
  await connectDB();

  // Clear existing data
  await Organization.deleteMany();
  await User.deleteMany();
  await Role.deleteMany();

  console.log("Migrations completed.");
  process.exit();
};

migrate();
