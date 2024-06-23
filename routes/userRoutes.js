const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  register,
  login,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
