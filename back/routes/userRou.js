
const express = require("express");

const { getUsers } = require("../controllers/userCon");

const authMiddleware = require("../middleware/authMid");

const router = express.Router();

// Get all users
router.get("/", authMiddleware, getUsers);

module.exports = router;
