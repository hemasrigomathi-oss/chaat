import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  .register-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 20px;
    position: relative;
    overflow: hidden;
    font-family: "DM Sans", sans-serif;
    background:
      radial-gradient(
        circle at 15% 20%,
        rgba(32, 224, 196, 0.09),
        transparent 28%
      ),
      radial-gradient(
        circle at 85% 80%,
        rgba(56, 189, 248, 0.08),
        transparent 28%
      ),
      #080b12;
  }

  .register-page::before {
    content: "";
    position: absolute;
    width: 420px;
    height: 420px;
    top: -220px;
    left: -180px;
    border-radius: 50%;
    border: 1px solid rgba(32, 224, 196, 0.08);
    box-shadow:
      0 0 100px rgba(32, 224, 196, 0.05);
    animation: orbitOne 10s ease-in-out infinite;
  }

  .register-page::after {
    content: "";
    position: absolute;
    width: 350px;
    height: 350px;
    right: -170px;
    bottom: -180px;
    border-radius: 50%;
    border: 1px solid rgba(56, 189, 248, 0.08);
    box-shadow:
      0 0 100px rgba(56, 189, 248, 0.05);
    animation: orbitTwo 12s ease-in-out infinite;
  }

  .register-card {
    width: 100%;
    max-width: 450px;
    padding: 42px;
    position: relative;
    z-index: 2;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 26px;
    background: rgba(16, 21, 31, 0.88);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    box-shadow:
      0 30px 90px rgba(0, 0, 0, 0.45),
      0 0 60px rgba(32, 224, 196, 0.035);
    animation: cardEntry 0.7s ease forwards;
  }

  .register-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 26px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(32, 224, 196, 0.3),
      transparent 35%,
      transparent 65%,
      rgba(56, 189, 248, 0.2)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .register-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 34px;
    animation: fadeDown 0.7s ease 0.1s both;
  }

  .register-brand-icon {
    width: 52px;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    color: #06110f;
    background: #20e0c4;
    font-family: "Space Grotesk", sans-serif;
    font-size: 23px;
    font-weight: 700;
    box-shadow:
      0 0 25px rgba(32, 224, 196, 0.25);
    animation: iconGlow 3s ease-in-out infinite;
  }

  .register-brand h1 {
    margin: 0;
    color: #f8fafc;
    font-family: "Space Grotesk", sans-serif;
    font-size: 27px;
    font-weight: 700;
    letter-spacing: -0.7px;
  }

  .register-brand p {
    margin: 3px 0 0;
    color: #718096;
    font-size: 12px;
    letter-spacing: 0.2px;
  }

  .register-heading {
    margin-bottom: 27px;
    animation: fadeDown 0.7s ease 0.2s both;
  }

  .register-heading h2 {
    margin: 0 0 7px;
    color: #f1f5f9;
    font-family: "Space Grotesk", sans-serif;
    font-size: 29px;
    font-weight: 600;
    letter-spacing: -0.8px;
  }

  .register-heading p {
    margin: 0;
    color: #7d899b;
    font-size: 14px;
  }

  .register-error {
    padding: 12px 14px;
    margin-bottom: 19px;
    border: 1px solid rgba(248, 113, 113, 0.25);
    border-radius: 11px;
    color: #fca5a5;
    background: rgba(127, 29, 29, 0.15);
    font-size: 13px;
    animation: errorShake 0.4s ease;
  }

  .register-form {
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .register-input-group {
    margin-bottom: 18px;
  }

  .register-input-group label {
    display: block;
    margin-bottom: 8px;
    color: #aeb8c7;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .register-input-group input {
    width: 100%;
    height: 52px;
    padding: 0 16px;
    border: 1px solid #222b39;
    border-radius: 12px;
    outline: none;
    color: #edf2f7;
    background: #0b1018;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease,
      background 0.3s ease,
      transform 0.3s ease;
  }

  .register-input-group input::placeholder {
    color: #4e5969;
  }

  .register-input-group input:hover {
    border-color: #344154;
  }

  .register-input-group input:focus {
    border-color: #20e0c4;
    background: #0d131c;
    transform: translateY(-1px);
    box-shadow:
      0 0 0 3px rgba(32, 224, 196, 0.08),
      0 0 25px rgba(32, 224, 196, 0.06);
  }

  .register-btn {
    width: 100%;
    height: 53px;
    margin-top: 5px;
    position: relative;
    overflow: hidden;
    border: none;
    border-radius: 12px;
    color: #06110f;
    background: #20e0c4;
    font-family: "Space Grotesk", sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.2px;
    cursor: pointer;
    box-shadow:
      0 10px 30px rgba(32, 224, 196, 0.15);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease,
      background 0.3s ease;
  }

  .register-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -120%;
    width: 70%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.35),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  .register-btn:hover::before {
    left: 140%;
  }

  .register-btn:hover {
    background: #38e8cd;
    transform: translateY(-2px);
    box-shadow:
      0 15px 35px rgba(32, 224, 196, 0.22);
  }

  .register-btn:active {
    transform: translateY(0);
  }

  .register-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .register-switch {
    margin-top: 27px;
    text-align: center;
    color: #657184;
    font-size: 13px;
    animation: fadeUp 0.7s ease 0.4s both;
  }

  .register-switch a {
    margin-left: 5px;
    color: #20e0c4;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.25s ease;
  }

  .register-switch a:hover {
    color: #67f2dc;
  }

  @keyframes cardEntry {
    from {
      opacity: 0;
      transform: translateY(25px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes fadeDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes iconGlow {
    0%,
    100% {
      box-shadow:
        0 0 20px rgba(32, 224, 196, 0.18);
      transform: translateY(0);
    }

    50% {
      box-shadow:
        0 0 35px rgba(32, 224, 196, 0.32);
      transform: translateY(-3px);
    }
  }

  @keyframes orbitOne {
    0%,
    100% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(45px, 30px);
    }
  }

  @keyframes orbitTwo {
    0%,
    100% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(-35px, -30px);
    }
  }

  @keyframes errorShake {
    0%,
    100% {
      transform: translateX(0);
    }

    25% {
      transform: translateX(-5px);
    }

    75% {
      transform: translateX(5px);
    }
  }

  @media (max-width: 520px) {
    .register-page {
      padding: 20px 15px;
    }

    .register-card {
      padding: 32px 24px;
      border-radius: 22px;
    }

    .register-heading h2 {
      font-size: 26px;
    }
  }
`}</style>
      <div className="register-page">
        <div className="register-card">

          <div className="register-brand">
            <div className="register-brand-icon">
              S
            </div>

            <div>
              <h1>Syncly</h1>
              <p>Connect. Chat. Share.</p>
            </div>
          </div>

          <div className="register-heading">
            <h2>Create account</h2>
            <p>Join the conversation today</p>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-input-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>
          </form>

          <div className="register-switch">
            Already have an account?

            <Link to="/login">
              Login
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default Register;