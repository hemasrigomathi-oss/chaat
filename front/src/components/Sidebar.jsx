import React from "react";
import UserList from "./UserList";
import { useAuth } from "../context/AuthContext";

function Sidebar({ selectedUser, onSelectUser }) {
  const { user, logout } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .sidebar {
          width: 320px;
          height: 100vh;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(148, 163, 184, 0.09);
          background: #0b1018;
          color: #f1f5f9;
          font-family: "DM Sans", sans-serif;
        }

        .sidebar::after {
          content: "";
          width: 220px;
          height: 220px;
          position: absolute;
          right: -150px;
          top: 120px;
          border-radius: 50%;
          background: rgba(32, 224, 196, 0.035);
          filter: blur(40px);
          pointer-events: none;
        }

        .sidebar-header {
          height: 82px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon.small {
          width: 42px;
          height: 42px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 13px;
          color: #06110f;
          background: #20e0c4;
          font-family: "Space Grotesk", sans-serif;
          font-size: 18px;
          font-weight: 700;
          box-shadow:
            0 0 22px rgba(32, 224, 196, 0.2);
          animation: brandPulse 3s ease-in-out infinite;
        }

        .sidebar-brand h2 {
          margin: 0;
          color: #f8fafc;
          font-family: "Space Grotesk", sans-serif;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.4px;
        }

        .sidebar-brand span {
          display: block;
          margin-top: 2px;
          color: #596779;
          font-size: 10px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .logout-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 10px;
          color: #657184;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          transition:
            color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }

        .logout-btn:hover {
          color: #20e0c4;
          background: rgba(32, 224, 196, 0.06);
          transform: translateX(2px);
        }

        .current-user {
          margin: 18px 16px 14px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(148, 163, 184, 0.08);
          border-radius: 15px;
          background: #10161f;
          animation: userEntry 0.5s ease;
        }

        .current-user .avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 12px;
          color: #20e0c4;
          background: #16252b;
          font-family: "Space Grotesk", sans-serif;
          font-size: 14px;
          font-weight: 700;
        }

        .current-user-info {
          min-width: 0;
          flex: 1;
        }

        .current-user-info strong {
          display: block;
          overflow: hidden;
          color: #e7edf5;
          font-size: 13px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .current-user-info span {
          display: block;
          margin-top: 3px;
          color: #20e0c4;
          font-size: 10px;
        }

        .online-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #20e0c4;
          box-shadow:
            0 0 10px rgba(32, 224, 196, 0.7);
          animation: dotPulse 2s infinite;
        }

        .user-list-heading {
          padding: 5px 20px 12px;
          color: #596779;
          font-family: "Space Grotesk", sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .sidebar > * {
          position: relative;
          z-index: 2;
        }

        @keyframes brandPulse {
          0%,
          100% {
            box-shadow:
              0 0 18px rgba(32, 224, 196, 0.15);
          }

          50% {
            box-shadow:
              0 0 28px rgba(32, 224, 196, 0.28);
          }
        }

        @keyframes userEntry {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dotPulse {
          0%,
          100% {
            box-shadow:
              0 0 4px rgba(32, 224, 196, 0.4);
          }

          50% {
            box-shadow:
              0 0 12px rgba(32, 224, 196, 0.9);
          }
        }

        @media (max-width: 700px) {
          .sidebar {
            width: 250px;
          }
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon small">
              S
            </div>

            <div>
              <h2>Syncly</h2>
              <span>Messages</span>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={logout}
            title="Logout"
          >
            ↪
          </button>
        </div>

        <div className="current-user">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="current-user-info">
            <strong>{user?.name}</strong>
            <span>Active now</span>
          </div>

          <div className="online-dot"></div>
        </div>

        <div className="user-list-heading">
          <span>Contacts</span>
        </div>

        <UserList
          selectedUser={selectedUser}
          onSelectUser={onSelectUser}
        />
      </aside>
    </>
  );
}

export default Sidebar;