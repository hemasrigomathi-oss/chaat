import React, { useRef, useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const fileInput = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSend(text.trim());

    setText("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log(
      "Selected file:",
      file.name
    );

    e.target.value = "";
  };

  return (
    <>
      <style>{`

        .message-input-area {
          position: relative;

          padding:
            9px 16px 11px;

          background: #0d131c;

          border-top:
            1px solid #202936;

          font-family:
            "DM Sans",
            sans-serif;
        }

        .input-wrapper {
          display: flex;

          align-items: center;

          gap: 8px;

          width: 100%;

          min-height: 48px;

          padding:
            4px 6px 4px 7px;

          background: #131a24;

          border:
            1px solid #273241;

          border-radius: 14px;

          box-shadow:
            0 6px 20px
            rgba(0, 0, 0, 0.2);

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .input-wrapper:focus-within {
          border-color:
            rgba(32, 224, 196, 0.45);

          box-shadow:
            0 6px 25px
            rgba(0, 0, 0, 0.25),

            0 0 0 3px
            rgba(32, 224, 196, 0.05);
        }

        /* PLUS */

        .attachment-btn {
          width: 34px;
          height: 34px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 9px;

          background: transparent;

          color: #718091;

          font-size: 24px;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .attachment-btn:hover {
          color: #20e0c4;

          background:
            rgba(32, 224, 196, 0.08);

          transform: scale(1.06);
        }

        /* INPUT */

        .input-wrapper input {
          flex: 1;

          min-width: 0;

          width: 100%;

          height: 34px;

          border: none !important;

          outline: none !important;

          background:
            transparent !important;

          color:
            #ffffff !important;

          font-family:
            "DM Sans",
            sans-serif;

          font-size: 14px;

          caret-color:
            #20e0c4;
        }

        .input-wrapper input::placeholder {
          color:
            #657284 !important;

          opacity: 1;
        }

        /* SEND */

        .send-btn {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 11px;

          background:
            #20e0c4;

          color:
            #07110f;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .send-btn:hover {
          background:
            #39ebd2;

          transform:
            translateY(-1px);
        }

        .send-btn:active {
          transform:
            scale(0.94);
        }

        .send-btn span {
          font-size: 15px;

          font-weight: bold;
        }

        /* HIDDEN FILE */

        .hidden-file-input {
          display: none;
        }

        @media (max-width: 700px) {

          .message-input-area {
            padding:
              7px 10px 9px;
          }

          .input-wrapper {
            min-height: 46px;

            border-radius: 13px;
          }

          .send-btn {
            width: 36px;
            height: 36px;
          }

        }

      `}</style>

      <form
        className="message-input-area"
        onSubmit={handleSubmit}
      >

        <div className="input-wrapper">

          {/* FILE */}

          <button
            type="button"
            className="attachment-btn"
            onClick={() =>
              fileInput.current?.click()
            }
          >
            +
          </button>

          {/* TEXT */}

          <input
            type="text"
            placeholder="Write a message..."
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
          />

          {/* SEND */}

          <button
            type="submit"
            className="send-btn"
          >
            <span>➤</span>
          </button>

        </div>

        <input
          ref={fileInput}
          type="file"
          className="hidden-file-input"
          onChange={handleFileSelect}
        />

      </form>
    </>
  );
}

export default MessageInput;