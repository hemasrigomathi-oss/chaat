import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="chat-app">
      <Sidebar
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      <ChatWindow selectedUser={selectedUser} />
    </div>
  );
}

export default Chat;