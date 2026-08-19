import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useLang } from "../utils/LanguageContext";

function Login() {
  const { lang, t } = useLang();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef(null);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!email.trim() || !password) throw new Error("All fields are required");
      login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f0f4f8" }}>
      <div className="card border-0 shadow-lg" style={{ borderRadius: "20px", width: "100%", maxWidth: 420 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary mb-1">{t.appName}</h2>
            <p className="text-muted small">{lang === "ar" ? "سجّل دخولك للمتابعة" : "Sign in to continue"}</p>
          </div>
          {error && <div className="alert alert-danger py-2 small" style={{ borderRadius: "10px" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">{t.email || "Email"}</label>
              <input ref={emailRef} type="email" className="form-control" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: "12px", border: "2px solid #e8ecf0", padding: "10px 14px" }} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold small">{t.password || "Password"}</label>
              <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: "12px", border: "2px solid #e8ecf0", padding: "10px 14px" }} />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold py-2" style={{ borderRadius: "12px" }}>
              {t.login || "Login"}
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-muted small">{t.noAccount || "Don't have an account?"} </span>
            <Link to="/register" className="text-primary fw-semibold small text-decoration-none">{t.register || "Register"}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
