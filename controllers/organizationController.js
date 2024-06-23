const Organization = require("../models/Organization");
const User = require("../models/User");

exports.createOrganization = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newOrg = new Organization({ name, description });
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrganizations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("role");
    const roleName = user.role.name;

    if (roleName === "admin") {
      const organizations = await Organization.find().populate("users");
      res.json(organizations);
    } else {
      res.json({
        message: "Access restricted. Only admins can view organizations.",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const organizations = await Organization.find({
      _id: req.user.organization._id,
    }).populate("users");
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedOrg = await Organization.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.json(updatedOrg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrganization = async (req, res) => {
  const { id } = req.params;
  try {
    await Organization.findByIdAndDelete(id);
    res.json({ message: "Organization deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
