const express = require("express");

const {
  sendMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageCon");

const authMiddleware = require("../middleware/authMid");

const router = express.Router();


// ==========================================
// SEND MESSAGE
// ==========================================

router.post(
  "/send",
  authMiddleware,
  sendMessage
);


// ==========================================
// GET MESSAGES
// ==========================================

router.get(
  "/:userId",
  authMiddleware,
  getMessages
);


// ==========================================
// DELETE MESSAGE
// ==========================================

router.delete(
  "/:messageId",
  authMiddleware,
  deleteMessage
);


module.exports = router;