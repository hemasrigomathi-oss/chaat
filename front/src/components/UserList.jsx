import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function UserList({ selectedUser, onSelectUser }) {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");

        const otherUsers = response.data.users.filter(
          (item) => item._id !== user?.id
        );

        setUsers(otherUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUsers();
    }
  }, [user]);

  const filteredUsers = users.filter((item) => {
    const name = item.name || "";
    const email = item.email || "";
    const search = searchText.toLowerCase();

    return (
      name.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search)
    );
  });

  return (
    <div className="users-container">
      <div className="search-box">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Search people..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="users">
        {loading ? (
          <div className="empty-users">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-users">
            No users found
          </div>
        ) : (
          filteredUsers.map((item) => (
            <button
              key={item._id}
              className={`user-item ${
                selectedUser?._id === item._id
                  ? "selected"
                  : ""
              }`}
              onClick={() => onSelectUser(item)}
            >
              <div className="avatar">
                {(item.name || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="user-info">
                <strong>{item.name || "Unknown User"}</strong>
                <span>{item.email}</span>
              </div>

              <div className="small-online-dot"></div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;