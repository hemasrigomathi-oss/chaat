const onlineUsers = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User comes online
    socket.on("userOnline", (userId) => {
      onlineUsers.set(String(userId), socket.id);

      console.log("User online:", userId);

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );
    });

    // Send message
    socket.on("sendMessage", (message) => {
      console.log("Socket message:", message);

      const receiverId =
        message.receiver?._id || message.receiver;

      const receiverSocketId =
        onlineUsers.get(String(receiverId));

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "receiveMessage",
          message
        );

        console.log(
          "Message sent to receiver:",
          receiverId
        );
      } else {
        console.log(
          "Receiver is offline:",
          receiverId
        );
      }
    });

    // Delete message for everyone
    socket.on("deleteMessage", ({ messageId }) => {
      console.log("Message deleted:", messageId);

      socket.broadcast.emit("messageDeleted", {
        messageId,
      });
    });

    // User disconnects
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          console.log("User offline:", userId);
          break;
        }
      }

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );

      console.log(
        "User disconnected:",
        socket.id
      );
    });
  });
};

module.exports = setupSocket;