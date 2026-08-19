import { useState, useEffect } from "react";
import { useLang } from "../utils/LanguageContext";

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_AR = ["\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0627\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633", "\u0627\u0644\u062C\u0645\u0639\u0629", "\u0627\u0644\u0633\u0628\u062A"];
const DAY_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

function ScheduleWidget() {
  const { lang, t } = useLang();
  const [slots, setSlots] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fixedSchedule") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "fixedSchedule") {
        try { setSlots(JSON.parse(e.newValue || "[]")); } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const dayNames = lang === "ar" ? DAYS_AR : DAYS_EN;
  const todayIndex = new Date().getDay();
  const todaySlots = slots.filter((s) => s.day === todayIndex).sort((a, b) => a.from.localeCompare(b.from));

  if (todaySlots.length === 0) return null;

  return (
    <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "16px" }}>
      <div className="card-body p-3">
        <h6 className="fw-bold mb-2">{t.fixedSchedule} <span className="text-muted" style={{ fontSize: "0.75rem" }}>- {dayNames[todayIndex]}</span></h6>
        <div className="d-flex flex-column gap-1">
          {todaySlots.map((slot) => (
            <div key={slot.id} className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ backgroundColor: "#f8f9fb" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: DAY_COLORS[slot.day], flexShrink: 0 }} />
              <span className="text-muted small" style={{ minWidth: 100 }}>{slot.from} - {slot.to}</span>
              <span className="fw-semibold small">{slot.activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScheduleWidget;
