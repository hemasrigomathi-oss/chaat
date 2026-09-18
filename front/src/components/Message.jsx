import React, { useState, useEffect, useRef } from "react";

function Message({ message, currentUserId, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const senderId = message.sender?._id || message.sender;

  const isMine = String(senderId) === String(currentUserId);

  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  /* =========================
     CLOSE MENU OUTSIDE
  ========================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================
     COPY
  ========================= */

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text || "");
      setShowMenu(false);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = () => {
    setShowMenu(false);

    if (onDelete) {
      onDelete(message._id);
    }
  };

  return (
    <>
      <style>{`

        /* =================================
           MESSAGE ROW
        ================================= */

        .message-row {
          width: 100% !important;

          display: flex !important;

          justify-content: flex-start;

          align-items: flex-start !important;

          height: auto !important;

          min-height: 0 !important;

          margin: 0 0 3px 0 !important;

          padding: 0 !important;

          box-sizing: border-box;

          animation: messageIn 0.25s ease;
        }

        .message-row.mine {
          justify-content: flex-end !important;
        }

        .message-row.theirs {
          justify-content: flex-start !important;
        }


        /* =================================
           MESSAGE CONTENT
        ================================= */

        .message-content {
          position: relative;

          display: block !important;

          width: fit-content !important;

          max-width: 70% !important;

          min-width: 0 !important;

          height: auto !important;

          min-height: 0 !important;

          flex: 0 0 auto !important;

          align-self: flex-start !important;

          margin: 0 !important;

          padding: 0 !important;

          box-sizing: border-box;
        }


        /* =================================
           MESSAGE BUBBLE
        ================================= */

        .message-bubble {
          position: relative !important;

          display: flex !important;

          flex-direction: column !important;

          /*
             IMPORTANT:
             Prevent any global space-between
             from creating the large gap.
          */

          justify-content: flex-start !important;

          align-items: flex-start !important;

          width: fit-content !important;

          max-width: 100% !important;

          min-width: 0 !important;

          /*
             FORCE BUBBLE TO FIT CONTENT
          */

          height: auto !important;

          min-height: 0 !important;

          max-height: none !important;

          flex: 0 0 auto !important;

          align-self: flex-start !important;

          margin: 0 !important;

          padding: 5px 8px 3px !important;

          box-sizing: border-box;

          border-radius: 12px;

          background: #151c27;

          border: 1px solid #273241;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.15);

          word-wrap: break-word;

          overflow-wrap: anywhere;

          overflow: visible;
        }


        /* =================================
           MY MESSAGE
        ================================= */

        .message-row.mine .message-bubble {

          background:
            linear-gradient(
              135deg,
              #163b3d,
              #12302f
            );

          border:
            1px solid
            rgba(32, 224, 196, 0.22);

          border-top-right-radius: 4px;
        }


        /* =================================
           OTHER MESSAGE
        ================================= */

        .message-row.theirs .message-bubble {

          border-top-left-radius: 4px;
        }


        /* =================================
           MESSAGE TEXT
        ================================= */

        .message-bubble p {

          display: block !important;

          width: auto !important;

          height: auto !important;

          min-height: 0 !important;

          max-height: none !important;

          flex: 0 0 auto !important;

          margin: 0 !important;

          padding: 0 !important;

          color: #edf4f5;

          font-family:
            "DM Sans",
            sans-serif;

          font-size: 14px;

          font-weight: 400;

          line-height: 1.2;

          white-space: pre-wrap;

          word-break: normal;

          overflow-wrap: anywhere;

          box-sizing: border-box;
        }


        /* =================================
           TIME
        ================================= */

        .message-time {

          /*
             TIME + TICK ON SAME LINE
          */

          display: flex !important;

          flex-direction: row !important;

          flex-wrap: nowrap !important;

          align-items: center !important;

          justify-content: flex-end !important;

          align-self: flex-end !important;

          width: max-content !important;

          height: auto !important;

          min-height: 0 !important;

          max-height: none !important;

          flex: 0 0 auto !important;

          margin: 1px 0 0 0 !important;

          padding: 0 !important;

          gap: 3px;

          color: #687788;

          font-family:
            "DM Sans",
            sans-serif;

          font-size: 8px;

          line-height: 1 !important;

          white-space: nowrap !important;

          box-sizing: border-box;
        }


        /* =================================
           MY MESSAGE TIME
        ================================= */

        .message-row.mine .message-time {
          color: #7ba9a4;
        }


        /* =================================
           DOUBLE TICK
        ================================= */

        .message-status {

          display: inline-flex !important;

          flex-direction: row !important;

          align-items: center !important;

          justify-content: center !important;

          width: auto !important;

          height: auto !important;

          min-height: 0 !important;

          margin: 0 !important;

          padding: 0 !important;

          color: #20e0c4;

          font-size: 8px;

          line-height: 1 !important;

          letter-spacing: -2px;

          white-space: nowrap !important;

          flex-shrink: 0 !important;
        }


        /* =================================
           THREE DOT BUTTON
        ================================= */

        .message-more {

          position: absolute !important;

          top: 2px;

          right: 2px;

          width: 22px;

          height: 22px;

          min-height: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border: none;

          border-radius: 6px;

          background:
            rgba(0, 0, 0, 0.28);

          color: #84909e;

          font-size: 15px;

          line-height: 1;

          cursor: pointer;

          opacity: 0;

          padding: 0;

          transition:
            opacity 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }


        .message-bubble:hover .message-more {
          opacity: 1;
        }


        .message-more:hover {

          background:
            rgba(32, 224, 196, 0.12);

          color: #20e0c4;
        }


        /* =================================
           MENU
        ================================= */

        .message-menu {

          position: absolute;

          top: 29px;

          right: 2px;

          width: 140px;

          padding: 4px;

          background: #111821;

          border: 1px solid #293442;

          border-radius: 10px;

          box-shadow:
            0 15px 35px
            rgba(0, 0, 0, 0.45);

          z-index: 9999;

          animation:
            menuOpen 0.18s ease;
        }


        .message-row.theirs .message-menu {

          left: 2px;

          right: auto;
        }


        /* =================================
           MENU ITEM
        ================================= */

        .message-menu-item {

          width: 100%;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 8px;

          border: none;

          border-radius: 7px;

          background: transparent;

          color: #d5dde5;

          font-family:
            "DM Sans",
            sans-serif;

          font-size: 13px;

          text-align: left;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }


        .message-menu-item:hover {

          background: #1c2732;

          color: #20e0c4;
        }


        .message-menu-item.delete:hover {

          background:
            rgba(255, 80, 80, 0.08);

          color: #ff6b6b;
        }


        /* =================================
           MENU ICON
        ================================= */

        .menu-icon {

          width: 20px;

          text-align: center;

          font-size: 14px;
        }


        /* =================================
           MESSAGE ANIMATION
        ================================= */

        @keyframes messageIn {

          from {
            opacity: 0;

            transform:
              translateY(6px)
              scale(0.98);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }


        /* =================================
           MENU ANIMATION
        ================================= */

        @keyframes menuOpen {

          from {

            opacity: 0;

            transform:
              translateY(-5px)
              scale(0.95);
          }

          to {

            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }


        /* =================================
           MOBILE
        ================================= */

        @media (max-width: 700px) {

          .message-row {

            margin-bottom: 2px !important;
          }

          .message-content {

            max-width: 78% !important;

            height: auto !important;

            min-height: 0 !important;

            flex: 0 0 auto !important;
          }

          .message-bubble {

            height: auto !important;

            min-height: 0 !important;

            padding:
              5px 8px 3px !important;

            justify-content: flex-start !important;
          }

          .message-bubble p {

            font-size: 14px;

            line-height: 1.2;

            height: auto !important;

            min-height: 0 !important;
          }

          .message-time {

            display: flex !important;

            flex-direction: row !important;

            flex-wrap: nowrap !important;

            margin-top: 1px !important;

            line-height: 1 !important;
          }

          .message-more {

            opacity: 1;
          }
        }

      `}</style>


      {/* =================================
          MESSAGE ROW
      ================================= */}

      <div
        className={`message-row ${
          isMine ? "mine" : "theirs"
        }`}
      >

        <div className="message-content">

          <div className="message-bubble">

            {/* THREE DOT BUTTON */}

            <button
              type="button"
              className="message-more"
              onClick={(e) => {
                e.stopPropagation();

                setShowMenu((prev) => !prev);
              }}
            >
              ⋮
            </button>


            {/* MESSAGE TEXT */}

            <p>
              {message.text}
            </p>


            {/* =================================
                TIME + TICK SAME LINE
            ================================= */}

            <span className="message-time">

              <span>
                {time}
              </span>

              {isMine && (
                <span className="message-status">
                  ✓✓
                </span>
              )}

            </span>


            {/* =================================
                MENU
            ================================= */}

            {showMenu && (

              <div
                className="message-menu"
                ref={menuRef}
              >

                {/* COPY */}

                <button
                  type="button"
                  className="message-menu-item"
                  onClick={handleCopy}
                >

                  <span className="menu-icon">
                    ⧉
                  </span>

                  Copy

                </button>


                {/* DELETE */}

                {isMine && (

                  <button
                    type="button"
                    className="message-menu-item delete"
                    onClick={handleDelete}
                  >

                    <span className="menu-icon">
                      🗑
                    </span>

                    Delete for everyone

                  </button>

                )}

              </div>

            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default Message;