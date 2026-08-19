import { useState, useCallback } from "react";
import { useLang } from "../utils/LanguageContext";
import { useAuth } from "../utils/AuthContext";

function Settings() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    try { return localStorage.getItem("setting_notifications") !== "false"; } catch { return true; }
  });
  const [sounds, setSounds] = useState(() => {
    try { return localStorage.getItem("setting_sounds") !== "false"; } catch { return true; }
  });
  const [pomodoroWork, setPomodoroWork] = useState(() => {
    try { return parseInt(localStorage.getItem("setting_pomodoroWork") || "25", 10); } catch { return 25; }
  });
  const [pomodoroShort, setPomodoroShort] = useState(() => {
    try { return parseInt(localStorage.getItem("setting_pomodoroShort") || "5", 10); } catch { return 5; }
  });
  const [pomodoroLong, setPomodoroLong] = useState(() => {
    try { return parseInt(localStorage.getItem("setting_pomodoroLong") || "15", 10); } catch { return 15; }
  });
  const [autoStart, setAutoStart] = useState(() => {
    try { return localStorage.getItem("setting_autoStart") === "true"; } catch { return false; }
  });
  const [saved, setSaved] = useState(false);

  const save = useCallback(() => {
    localStorage.setItem("setting_notifications", String(notifications));
    localStorage.setItem("setting_sounds", String(sounds));
    localStorage.setItem("setting_pomodoroWork", String(pomodoroWork));
    localStorage.setItem("setting_pomodoroShort", String(pomodoroShort));
    localStorage.setItem("setting_pomodoroLong", String(pomodoroLong));
    localStorage.setItem("setting_autoStart", String(autoStart));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [notifications, sounds, pomodoroWork, pomodoroShort, pomodoroLong, autoStart]);

  const handleClearAll = useCallback(() => {
    if (window.confirm(t.confirmClearData)) {
      localStorage.removeItem(`tasks_${user?.id}`);
      localStorage.removeItem("dismissedReminders");
      window.location.reload();
    }
  }, [t]);

  return (
    <div>
      <h4 className="fw-bold mb-4">{t.settings}</h4>

      {saved && (
        <div className="alert alert-success py-2 mb-3" style={{ borderRadius: "10px" }}>{t.settingsSaved}</div>
      )}

      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">{t.notifications}</h6>
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" id="notifSwitch" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            <label className="form-check-label" htmlFor="notifSwitch">{t.notificationsEnabled}</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="soundSwitch" checked={sounds} onChange={(e) => setSounds(e.target.checked)} />
            <label className="form-check-label" htmlFor="soundSwitch">{t.soundsEnabled}</label>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">{t.pomodoroSettings}</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">{t.workDuration}</label>
              <input type="number" min="1" max="180" className="form-control" value={pomodoroWork} onChange={(e) => setPomodoroWork(parseInt(e.target.value, 10) || 1)} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">{t.shortBreak}</label>
              <input type="number" min="1" max="60" className="form-control" value={pomodoroShort} onChange={(e) => setPomodoroShort(parseInt(e.target.value, 10) || 1)} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">{t.longBreak}</label>
              <input type="number" min="1" max="60" className="form-control" value={pomodoroLong} onChange={(e) => setPomodoroLong(parseInt(e.target.value, 10) || 1)} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
            </div>
          </div>
          <div className="form-check form-switch mt-3">
            <input className="form-check-input" type="checkbox" id="autoStartSwitch" checked={autoStart} onChange={(e) => setAutoStart(e.target.checked)} />
            <label className="form-check-label" htmlFor="autoStartSwitch">{t.autoStart}</label>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-2">{t.language}</h6>
          <p className="text-muted small mb-2">{t.currentLang}: {lang === "ar" ? "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" : "English"}</p>
          <p className="text-muted small mb-0">{lang === "ar" ? "\u0627\u0636\u063A\u0637 \u0639\u0644\u0649 '\u0639\u0631\u0628\u064A' \u0641\u064A \u0627\u0644\u0634\u0631\u0637\u0627\u0628 \u0644\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0644\u063A\u0629" : "Click 'EN' in the sidebar to switch language"}</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-2">{t.clearAllData}</h6>
          <p className="text-muted small mb-3">{t.clearAllDataDesc}</p>
          <button className="btn btn-danger btn-sm rounded-pill px-3" onClick={handleClearAll}>{t.clearAll}</button>
        </div>
      </div>

      <button className="btn btn-primary rounded-pill px-4 py-2 fw-semibold" onClick={save}>{t.save}</button>
    </div>
  );
}

export default Settings;
