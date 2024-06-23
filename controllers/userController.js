const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Role = require("../models/Role");
const Organization = require("../models/Organization");

// Create New user
exports.register = async (req, res) => {
  const { name, email, password, role, organizationName } = req.body;

  try {
    let userRole;

    // Find the role by name if provided, else find the default role
    if (role) {
      const roleByName = await Role.findOne({ name: role });

      if (roleByName) {
        userRole = roleByName;
      } else {
        return res.status(400).json({ error: "Role not found" });
      }
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      if (!defaultRole) {
        return res.status(400).json({ error: "Default role not found" });
      }
      userRole = defaultRole;
    }

    let userOrganization;

    if (organizationName && organizationName.trim()) {
      let organization = await Organization.findOne({ name: organizationName });
      if (!organization) {
        organization = new Organization({ name: organizationName });
        await organization.save();
      }
      userOrganization = organization._id;
    } else {
      const newOrganization = new Organization({
        name: name,
        description: name,
      });
      await newOrganization.save();
      userOrganization = newOrganization._id;
    }

    const newUser = new User({
      name,
      email,
      password,
      role: userRole,
      organization: userOrganization,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("role");
    const roleName = user.role.name;

    let users;
    if (roleName === "admin") {
      users = await User.find().populate("organization").populate("role");
    } else {
      users = await User.find({ _id: req.user.id })
        .populate("organization")
        .populate("role");
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    let user;
    user = await User.find({ _id: req.user.id })
      .populate("organization")
      .populate("role");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password, organizationName } = req.body;
  try {
    let userRole;
    let Org;

    // Find the role by name if provided, else find the default role
    if (role) {
      userRole = await Role.findOne({ name: role });
    }
    if (organizationName) {
      Org = await Organization.findOne({ name: organizationName });
      if (!Org) {
        const newOrganization = new Organization({
          name: organizationName,
          description: organizationName,
        });
        c;
        await newOrganization.save();
        userOrganization = newOrganization._id;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role: userRole._id, organization: userOrganization },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
