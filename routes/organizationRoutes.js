const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
  getOrganizationById,
} = require("../controllers/organizationController");

router.post("/", authenticate, createOrganization);
router.get("/", authenticate, getOrganizations);
router.get("/:id", authenticate, getOrganizationById);
router.put("/:id", authenticate, updateOrganization);
router.delete("/:id", authenticate, deleteOrganization);

module.exports = router;
