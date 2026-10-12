
import { useState } from "react";
import { CloudSun, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login, register } from "../../services/auth";
import "./AuthPage.css";

function getErrorMessage(error) {
  const data = error.response?.data;

  if (!data) {
    return "Could not connect to the server. Please try again.";
  }

  if (data.detail) return data.detail;

  const firstError = Object.values(data).flat()[0];
  return typeof firstError === "string"
    ? firstError
    : "Something went wrong. Please try again.";
}

function AuthPage({ onAuthenticated, onBack }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegister = mode === "register";

  const switchMode = () => {
    setMode(isRegister ? "login" : "register");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        await register({ username, email, password });

        setPassword("");
        setMode("login");
        setSuccess("Account created successfully. You can now sign in.");
      } else {
        const response = await login({ username, password });
        const { access, refresh } = response.data;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        await onAuthenticated();
      }
    } catch (err) {
      if (!isRegister && err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <button
          className="auth-back"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to weather
        </button>

        <div className="auth-brand">
          <span className="auth-brand__icon">
            <CloudSun size={28} />
          </span>
          <span>Skywatch</span>
        </div>

        <div className="auth-heading">
          <span className="auth-eyebrow">
            {isRegister ? "JOIN SKYWATCH" : "WELCOME BACK"}
          </span>

          <h1>
            {isRegister ? "Create your account" : "Welcome back."}
          </h1>

          <p>
            {isRegister
              ? "Save your favorite places and keep their weather close."
              : "Sign in to revisit the places you care about."}
          </p>
        </div>

        {success && (
          <div className="auth-message auth-message--success" role="status">
            {success}
          </div>
        )}

        {error && (
          <div className="auth-message auth-message--error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-username">Username</label>
          <input
            id="auth-username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Your username"
            required
          />

          {isRegister && (
            <>
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </>
          )}

          <label htmlFor="auth-password">Password</label>
          <div className="auth-password">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              minLength={isRegister ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={
                isRegister ? "At least 8 characters" : "Your password"
              }
              required
            />

            <button
              type="button"
              className="auth-password__toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister
            ? "Already have an account?"
            : "New to Skywatch?"}

          <button type="button" onClick={switchMode}>
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
