import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Message from "./Message";
import MessageInput from "./MessageInput";

const socket = io("http://localhost:5000");

function ChatWindow({ selectedUser }) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);

  /* =========================
     FETCH MESSAGES
  ========================= */

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await api.get(
          `/messages/${selectedUser._id}`
        );

        setMessages(response.data.messages || []);
      } catch (error) {
        console.error(
          "Failed to fetch messages:",
          error
        );
      }
    };

    fetchMessages();
  }, [selectedUser]);

  /* =========================
     RECEIVE MESSAGE
  ========================= */

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (!selectedUser) return;

      const senderId =
        message.sender?._id || message.sender;

      const receiverId =
        message.receiver?._id || message.receiver;

      const isCurrentConversation =
        (String(senderId) === String(user?.id) &&
          String(receiverId) ===
            String(selectedUser._id)) ||
        (String(senderId) ===
            String(selectedUser._id) &&
          String(receiverId) ===
            String(user?.id));

      if (isCurrentConversation) {
        setMessages((prev) => {
          const exists = prev.some(
            (item) => item._id === message._id
          );

          if (exists) return prev;

          return [...prev, message];
        });
      }
    };

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );
    };
  }, [selectedUser, user]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSendMessage = async (text) => {
    if (!selectedUser || !text.trim()) return;

    try {
      const response = await api.post(
        "/messages/send",
        {
          receiver: selectedUser._id,
          text: text.trim(),
        }
      );

      const newMessage = response.data.message;

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      socket.emit(
        "sendMessage",
        newMessage
      );
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
    }
  };

  /* =========================
     DELETE MESSAGE
  ========================= */

 const handleDeleteMessage = async (
  messageId
) => {
  try {
    // Delete from MongoDB
    await api.delete(
      `/messages/${messageId}`
    );

    // Remove from my screen immediately
    setMessages((prev) =>
      prev.filter(
        (message) =>
          message._id !== messageId
      )
    );

    // Tell the other user
    socket.emit("deleteMessage", {
      messageId,
    });

  } catch (error) {
    console.error(
      "Failed to delete message:",
      error
    );
  }
};
  /* =========================
     EMPTY CHAT
  ========================= */

  if (!selectedUser) {
    return (
      <>
        <style>{chatStyles}</style>

        <main className="chat-empty">

          <div className="empty-glow"></div>

          <div className="empty-chat-icon">
            <span>✦</span>
          </div>

          <h2>Your conversations</h2>

          <p>
            Select someone from your contacts
            to start chatting.
          </p>

          <div className="empty-line"></div>

        </main>
      </>
    );
  }

  /* =========================
     CHAT WINDOW
  ========================= */

  return (
    <>
      <style>{chatStyles}</style>

      <main className="chat-window">

        {/* HEADER */}

        <header className="chat-header">

          <div className="chat-profile">

            <div className="avatar large">

              {(selectedUser.name || "?")
                .charAt(0)
                .toUpperCase()}

              <span className="profile-online"></span>

            </div>

            <div className="chat-user-info">

              <h2>
                {selectedUser.name}
              </h2>

              <span className="online-status">
                <i></i>
                Online
              </span>

            </div>

          </div>

          <div className="chat-header-actions">

            <button
              type="button"
              title="Search"
            >
              ⌕
            </button>

            <button
              type="button"
              title="More"
            >
              •••
            </button>

          </div>

        </header>

        {/* MESSAGES */}

        <section className="messages-area">

          <div className="conversation-date">
            <span>Today</span>
          </div>

          {messages.length === 0 ? (

            <div className="no-messages">

              <div className="no-message-icon">
                ✦
              </div>

              <h3>
                Start a conversation
              </h3>

              <p>
                Send a message to{" "}
                {selectedUser.name}
              </p>

            </div>

          ) : (

            messages.map((message) => (

              <Message
                key={message._id}
                message={message}
                currentUserId={user?.id}
                onDelete={
                  handleDeleteMessage
                }
              />

            ))

          )}

        </section>

        {/* MESSAGE INPUT */}

        <MessageInput
          onSend={handleSendMessage}
        />

      </main>
    </>
  );
}


/* =====================================================
   CHAT WINDOW INTERNAL CSS
===================================================== */

const chatStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  .chat-window,
  .chat-empty {
    font-family: "DM Sans", sans-serif;
  }

  /* =========================
     MAIN CHAT
  ========================= */

  .chat-window {
    height: 100vh;
    min-width: 0;

    display: flex;
    flex-direction: column;

    position: relative;

    overflow: hidden;

    background:
      radial-gradient(
        circle at 80% 15%,
        rgba(32, 224, 196, 0.045),
        transparent 25%
      ),
      #080b12;
  }

  .chat-window::before {
    content: "";

    position: absolute;

    width: 500px;
    height: 500px;

    right: -280px;
    top: -250px;

    border-radius: 50%;

    border: 1px solid
      rgba(32, 224, 196, 0.06);

    pointer-events: none;

    animation:
      chatOrb 12s ease-in-out infinite;
  }

  /* =========================
     HEADER
  ========================= */

  .chat-header {
    min-height: 82px;

    padding: 0 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    position: relative;
    z-index: 5;

    border-bottom:
      1px solid
      rgba(148, 163, 184, 0.09);

    background:
      rgba(10, 14, 21, 0.78);

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);

    animation:
      headerDown 0.5s ease;
  }

  .chat-profile {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  /* =========================
     AVATAR
  ========================= */

  .avatar {
    width: 44px;
    height: 44px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    border:
      1px solid
      rgba(32, 224, 196, 0.2);

    border-radius: 14px;

    color: #20e0c4;

    background:
      linear-gradient(
        145deg,
        #16242b,
        #10171f
      );

    font-family:
      "Space Grotesk",
      sans-serif;

    font-size: 15px;
    font-weight: 700;

    box-shadow:
      0 5px 20px
      rgba(0, 0, 0, 0.2);
  }

  .avatar.large {
    width: 48px;
    height: 48px;

    border-radius: 15px;

    font-size: 17px;
  }

  /* =========================
     ONLINE
  ========================= */

  .profile-online {
    width: 10px;
    height: 10px;

    position: absolute;

    right: -2px;
    bottom: -2px;

    border:
      2px solid #080b12;

    border-radius: 50%;

    background: #20e0c4;

    box-shadow:
      0 0 10px
      rgba(32, 224, 196, 0.7);

    animation:
      onlinePulse 2s infinite;
  }

  .chat-user-info h2 {
    margin: 0;

    color: #f1f5f9;

    font-family:
      "Space Grotesk",
      sans-serif;

    font-size: 16px;
    font-weight: 600;

    letter-spacing: -0.2px;
  }

  .online-status {
    display: flex;
    align-items: center;

    gap: 6px;

    margin-top: 3px;

    color: #697789;

    font-size: 11px;
  }

  .online-status i {
    width: 6px;
    height: 6px;

    display: block;

    border-radius: 50%;

    background: #20e0c4;

    box-shadow:
      0 0 8px
      rgba(32, 224, 196, 0.7);
  }

  /* =========================
     HEADER BUTTONS
  ========================= */

  .chat-header-actions {
    display: flex;
    align-items: center;

    gap: 5px;
  }

  .chat-header-actions button {
    width: 38px;
    height: 38px;

    border:
      1px solid transparent;

    border-radius: 11px;

    color: #687688;

    background: transparent;

    font-family:
      "DM Sans",
      sans-serif;

    font-size: 19px;

    cursor: pointer;

    transition: all 0.25s ease;
  }

  .chat-header-actions button:hover {
    color: #20e0c4;

    border-color:
      rgba(32, 224, 196, 0.1);

    background:
      rgba(32, 224, 196, 0.05);

    transform:
      translateY(-1px);
  }

  /* =========================
     MESSAGES AREA
  ========================= */

  .messages-area {
    flex: 1;

    padding: 25px 30px;

    position: relative;
    z-index: 2;

    overflow-y: auto;

    scroll-behavior: smooth;
  }

  .messages-area::-webkit-scrollbar {
    width: 5px;
  }

  .messages-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-area::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #202a36;
  }

  /* =========================
     DATE
  ========================= */

  .conversation-date {
    display: flex;

    justify-content: center;

    margin-bottom: 25px;
  }

  .conversation-date span {
    padding: 5px 12px;

    border:
      1px solid
      rgba(148, 163, 184, 0.08);

    border-radius: 20px;

    color: #566274;

    background:
      rgba(16, 21, 31, 0.65);

    font-size: 10px;

    letter-spacing: 0.5px;
  }

  /* =========================
     NO MESSAGES
  ========================= */

  .no-messages {
    min-height: 55%;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    text-align: center;

    animation:
      messageWelcome 0.6s ease;
  }

  .no-message-icon {
    width: 60px;
    height: 60px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 17px;

    border:
      1px solid
      rgba(32, 224, 196, 0.15);

    border-radius: 20px;

    color: #20e0c4;

    background:
      rgba(32, 224, 196, 0.04);

    font-size: 23px;

    box-shadow:
      0 0 30px
      rgba(32, 224, 196, 0.05);

    animation:
      welcomeFloat 3s ease-in-out infinite;
  }

  .no-messages h3 {
    margin: 0 0 7px;

    color: #dbe3ed;

    font-family:
      "Space Grotesk",
      sans-serif;

    font-size: 17px;
    font-weight: 600;
  }

  .no-messages p {
    margin: 0;

    color: #647184;

    font-size: 12px;
  }

  /* =========================
     EMPTY CHAT
  ========================= */

  .chat-empty {
    height: 100vh;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    position: relative;

    overflow: hidden;

    text-align: center;

    background: #080b12;
  }

  .empty-glow {
    width: 250px;
    height: 250px;

    position: absolute;

    border-radius: 50%;

    background:
      rgba(32, 224, 196, 0.045);

    filter: blur(50px);

    animation:
      emptyGlow 4s ease-in-out infinite;
  }

  .empty-chat-icon {
    width: 72px;
    height: 72px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    z-index: 2;

    border:
      1px solid
      rgba(32, 224, 196, 0.18);

    border-radius: 23px;

    color: #20e0c4;

    background:
      rgba(32, 224, 196, 0.05);

    box-shadow:
      0 0 45px
      rgba(32, 224, 196, 0.08);

    font-size: 25px;

    animation:
      welcomeFloat 3s ease-in-out infinite;
  }

  .chat-empty h2 {
    margin: 22px 0 8px;

    position: relative;
    z-index: 2;

    color: #eef2f7;

    font-family:
      "Space Grotesk",
      sans-serif;

    font-size: 23px;
    font-weight: 600;
  }

  .chat-empty p {
    max-width: 300px;

    margin: 0;

    position: relative;
    z-index: 2;

    color: #657184;

    font-size: 13px;
    line-height: 1.7;
  }

  .empty-line {
    width: 45px;
    height: 2px;

    margin-top: 22px;

    position: relative;
    z-index: 2;

    border-radius: 10px;

    background: #20e0c4;

    box-shadow:
      0 0 15px
      rgba(32, 224, 196, 0.5);
  }

  /* =========================
     ANIMATIONS
  ========================= */

  @keyframes headerDown {
    from {
      opacity: 0;
      transform: translateY(-12px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes messageWelcome {
    from {
      opacity: 0;
      transform: translateY(15px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes welcomeFloat {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-6px);
    }
  }

  @keyframes onlinePulse {
    0%,
    100% {
      box-shadow:
        0 0 5px
        rgba(32, 224, 196, 0.4);
    }

    50% {
      box-shadow:
        0 0 13px
        rgba(32, 224, 196, 0.9);
    }
  }

  @keyframes chatOrb {
    0%,
    100% {
      transform:
        translate(0, 0);
    }

    50% {
      transform:
        translate(-35px, 30px);
    }
  }

  @keyframes emptyGlow {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.7;
    }

    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  /* =========================
     RESPONSIVE
  ========================= */

  @media (max-width: 700px) {

    .chat-header {
      min-height: 72px;
      padding: 0 16px;
    }

    .messages-area {
      padding: 20px 15px;
    }

    .chat-header-actions button {
      width: 34px;
      height: 34px;
    }
  }
`;

export default ChatWindow;