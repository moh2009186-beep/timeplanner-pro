import { useState, useEffect, useCallback } from "react";
import { useLang } from "../utils/LanguageContext";

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_AR = ["\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0627\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633", "\u0627\u0644\u062C\u0645\u0639\u0629", "\u0627\u0644\u0633\u0628\u062A"];

const DAY_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

function Schedule() {
  const { lang, t } = useLang();
  const days = lang === "ar" ? DAYS_AR : DAYS_EN;
  const [slots, setSlots] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fixedSchedule") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({ day: 0, from: "", to: "", activity: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("fixedSchedule", JSON.stringify(slots));
  }, [slots]);

  const addSlot = useCallback(() => {
    if (!form.from || !form.to || !form.activity.trim()) return;
    setSlots((prev) => [...prev, { id: Date.now(), ...form }]);
    setForm({ day: 0, from: "", to: "", activity: "" });
  }, [form]);

  const removeSlot = useCallback((id) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem("fixedSchedule", JSON.stringify(slots));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [slots]);

  const sortedByDay = [...slots].sort((a, b) => a.day - b.day || a.from.localeCompare(b.from));

  return (
    <div>
      <h4 className="fw-bold mb-1">{t.fixedSchedule}</h4>
      <p className="text-muted small mb-4">{t.fixedScheduleDesc}</p>

      {saved && (
        <div className="alert alert-success py-2 mb-3" style={{ borderRadius: "10px" }}>{t.scheduleSaved}</div>
      )}

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "14px" }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">{t.addSlot}</h6>
          <div className="row g-2 align-items-end">
            <div className="col-md-2">
              <label className="form-label small fw-semibold">{t.day}</label>
              <select className="form-select form-select-sm" value={form.day} onChange={(e) => setForm((p) => ({ ...p, day: parseInt(e.target.value) }))}
                style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }}>
                {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">{t.from}</label>
              <input type="time" className="form-control form-control-sm" value={form.from} onChange={(e) => setForm((p) => ({ ...p, from: e.target.value }))}
                style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">{t.to}</label>
              <input type="time" className="form-control form-control-sm" value={form.to} onChange={(e) => setForm((p) => ({ ...p, to: e.target.value }))}
                style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">{t.activity}</label>
              <input type="text" className="form-control form-control-sm" value={form.activity} onChange={(e) => setForm((p) => ({ ...p, activity: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") addSlot(); }}
                placeholder={t.activity} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary btn-sm w-100 rounded-pill" onClick={addSlot}>{t.addSlot}</button>
            </div>
          </div>
        </div>
      </div>

      {sortedByDay.length === 0 && (
        <div className="text-center py-5 text-muted">
          <p style={{ fontSize: 48 }}>📅</p>
          <p>{t.noSlotsYet}</p>
        </div>
      )}

      {days.map((dayName, dayIndex) => {
        const daySlots = sortedByDay.filter((s) => s.day === dayIndex);
        if (daySlots.length === 0) return null;
        return (
          <div key={dayIndex} className="mb-3">
            <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: DAY_COLORS[dayIndex], display: "inline-block" }} />
              {dayName}
              <span className="badge bg-light text-dark" style={{ fontSize: "0.65rem" }}>{daySlots.length}</span>
            </h6>
            <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
              <div className="table-responsive">
                <table className="table table-sm mb-0 align-middle">
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fb" }}>
                      <th className="small fw-semibold ps-3" style={{ width: 120 }}>{t.from}</th>
                      <th className="small fw-semibold" style={{ width: 120 }}>{t.to}</th>
                      <th className="small fw-semibold">{t.activity}</th>
                      <th className="pe-3" style={{ width: 60 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {daySlots.map((slot) => (
                      <tr key={slot.id}>
                        <td className="ps-3 fw-semibold small">{slot.from}</td>
                        <td className="fw-semibold small">{slot.to}</td>
                        <td className="small">
                          <span className="px-2 py-1 rounded-3 d-inline-block" style={{ backgroundColor: DAY_COLORS[dayIndex] + "15", color: DAY_COLORS[dayIndex], fontWeight: 600 }}>
                            {slot.activity}
                          </span>
                        </td>
                        <td className="pe-3 text-end">
                          <button className="btn btn-sm text-danger" style={{ fontSize: "0.75rem" }} onClick={() => removeSlot(slot.id)}>{t.deleteSlot}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}

      {sortedByDay.length > 0 && (
        <button className="btn btn-primary rounded-pill px-4 py-2 fw-semibold mt-2" onClick={handleSave}>{t.saveSchedule}</button>
      )}
    </div>
  );
}

export default Schedule;
