import { memo } from "react";
import { useLang } from "../utils/LanguageContext";

const STATUS_STYLES = {
  en: {
    Completed: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
    "In Progress": { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
    Pending: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  },
  ar: {
    "\u0645\u0643\u062A\u0645\u0644": { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
    "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630": { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
    "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631": { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  },
};

const CATEGORY_COLORS = {
  Work: { bg: "#dbeafe", color: "#1d4ed8" },
  Learning: { bg: "#fef3c7", color: "#b45309" },
  Personal: { bg: "#ede9fe", color: "#7c3aed" },
  Health: { bg: "#d1fae5", color: "#059669" },
  "\u0639\u0645\u0644": { bg: "#dbeafe", color: "#1d4ed8" },
  "\u062A\u0639\u0644\u064A\u0645": { bg: "#fef3c7", color: "#b45309" },
  "\u0634\u062E\u0635\u064A": { bg: "#ede9fe", color: "#7c3aed" },
  "\u0635\u062D\u0629": { bg: "#d1fae5", color: "#059669" },
};

const TaskCard = memo(function TaskCard({ task, showTime = true }) {
  const { lang } = useLang();
  const statusStyles = lang === "ar" ? STATUS_STYLES.ar : STATUS_STYLES.en;
  const st = statusStyles[task.status] || STATUS_STYLES.en["Pending"];
  const catStyle = CATEGORY_COLORS[task.category] || { bg: "#f3f4f6", color: "#374151" };

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div
      className="card mb-3 border-0 shadow-sm overflow-hidden"
      style={{ borderRadius: "14px" }}
    >
      <div
        className="d-flex align-items-center p-3 gap-3"
        style={{ borderLeft: `4px solid ${st.dot}` }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44, backgroundColor: st.bg, color: st.dot, fontSize: 18 }}
        >
          {task.status === "Completed" || task.status === "\u0645\u0643\u062A\u0645\u0644" ? "✅" : "○"}
        </div>
        <div className="flex-grow-1">
          <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>
            {task.title}
          </div>
          <div className="d-flex align-items-center gap-2 mt-1">
            <span
              className="badge"
              style={{
                backgroundColor: catStyle.bg,
                color: catStyle.color,
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              {task.category}
            </span>
            {showTime && task.time && (
              <small className="text-muted">{formatTime(task.time)}</small>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center gap-1">
          <button
            className="btn btn-sm p-1"
            data-action="edit"
            data-id={task.id}
            style={{ fontSize: "0.85rem" }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn btn-sm p-1"
            data-action="delete"
            data-id={task.id}
            style={{ fontSize: "0.85rem" }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
});

export default TaskCard;
