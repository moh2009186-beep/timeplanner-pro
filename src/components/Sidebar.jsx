import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLang } from "../utils/LanguageContext";
import { useAuth } from "../utils/AuthContext";

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_AR = ["\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0627\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633", "\u0627\u0644\u062C\u0645\u0639\u0629", "\u0627\u0644\u0633\u0628\u062A"];
const DAY_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { lang, toggleLang, t } = useLang();
  const { user, logout } = useAuth();
  const [slots, setSlots] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fixedSchedule") || "[]"); } catch { return []; }
  });

  const dayNames = lang === "ar" ? DAYS_AR : DAYS_EN;
  const todayIndex = new Date().getDay();
  const todaySlots = slots.filter((s) => s.day === todayIndex).sort((a, b) => a.from.localeCompare(b.from));

  const navItems = [
    { to: "/", label: t.dashboard || t.today, icon: "📊" },
    { to: "/tasks", label: t.tasks, icon: "✅" },
    { to: "/calendar", label: t.calendar, icon: "📅" },
    { to: "/schedule", label: t.fixedSchedule, icon: "🗓️" },
    { to: "/reminders", label: t.reminders, icon: "🔔" },
    { to: "/settings", label: t.settings, icon: "⚙️" },
  ];

  return (
    <>
      <button
        className="btn btn-sm btn-outline-secondary position-fixed top-0 start-0 m-2 d-lg-none z-3"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? "✕" : "☰"}
      </button>
      <aside
        className="sidebar bg-white border-end d-flex flex-column"
        dir={lang === "ar" ? "rtl" : "ltr"}
        style={{
          width: isOpen ? 240 : 0,
          minWidth: isOpen ? 240 : 0,
          overflow: "hidden",
          transition: "width 0.2s, min-width 0.2s",
        }}
      >
        <div className="px-3 pt-3 pb-2 mb-2">
          <span className="fs-5 fw-bold text-primary">{t.appName}</span>
        </div>

        {user && (
          <div className="mx-2 mb-2 p-2 rounded-3" style={{ backgroundColor: "#f0f4f8" }}>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 34, height: 34, fontSize: "0.8rem", backgroundColor: "#3b82f6" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <p className="mb-0 fw-semibold small text-truncate">{user.name}</p>
                <p className="mb-0 text-muted text-truncate" style={{ fontSize: "0.65rem" }}>{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-grow-1">
          <ul className="nav flex-column gap-1 px-2">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item">
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    "nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 small " +
                    (isActive
                      ? "bg-primary bg-opacity-10 text-primary fw-semibold"
                      : "text-secondary")
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {todaySlots.length > 0 && (
          <div className="px-2 mb-2">
            <div className="rounded-3 p-2" style={{ backgroundColor: "#f0f9ff" }}>
              <p className="small fw-bold mb-1 px-1" style={{ color: "#0369a1", fontSize: "0.7rem" }}>
                🗓️ {dayNames[todayIndex]}
              </p>
              {todaySlots.slice(0, 4).map((slot) => (
                <div key={slot.id} className="d-flex align-items-center gap-1 px-1 py-1 rounded-2 mb-1" style={{ backgroundColor: "#fff" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: DAY_COLORS[slot.day], flexShrink: 0 }} />
                  <span className="text-muted" style={{ fontSize: "0.6rem", minWidth: 68 }}>{slot.from}-{slot.to}</span>
                  <span className="fw-semibold text-truncate" style={{ fontSize: "0.65rem", color: "#333" }}>{slot.activity}</span>
                </div>
              ))}
              {todaySlots.length > 4 && (
                <p className="text-center mb-0" style={{ fontSize: "0.6rem", color: "#0369a1" }}>+{todaySlots.length - 4} more</p>
              )}
            </div>
          </div>
        )}

        <div className="px-2 pb-3 d-flex gap-2">
          <button className="btn btn-outline-primary flex-grow-1 rounded-3 fw-semibold small" onClick={toggleLang}>
            {t.langToggle}
          </button>
          <button className="btn btn-outline-danger rounded-3 fw-semibold small px-2" onClick={logout} title={t.logout}>
            🚪
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
