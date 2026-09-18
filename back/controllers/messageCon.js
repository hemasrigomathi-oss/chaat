const Message = require("../models/Message");

// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      text,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};


// ==========================================
// GET MESSAGES
// ==========================================

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user.id,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get messages",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE MESSAGE FOR EVERYONE
// ==========================================

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Find message
    const message = await Message.findById(
      messageId
    );

    // Message doesn't exist
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Only sender can delete
    if (
      String(message.sender) !==
      String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own messages",
      });
    }

    // Delete from MongoDB
    await Message.findByIdAndDelete(
      messageId
    );

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      messageId,
    });

  } catch (error) {
    console.error(
      "Delete message error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};


module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
};