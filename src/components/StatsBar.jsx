import { useLang } from "../utils/LanguageContext";

function StatsBar({ tasks }) {
  const { t } = useLang();
  const total = tasks.length;
  const completed = tasks.filter((tr) => tr.status === "Completed" || tr.status === "مكتمل").length;
  const inProgress = tasks.filter((tr) => tr.status === "In Progress" || tr.status === "قيد التنفيذ").length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = tasks.filter((tr) => {
    const d = new Date(tr.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;

  const stats = [
    { label: t.totalTasks || "Total Tasks", value: total, icon: "📋", color: "#6366f1", bg: "#eef2ff" },
    { label: t.completed, value: completed, icon: "✅", color: "#22c55e", bg: "#f0fdf4" },
    { label: t.inProgress, value: inProgress, icon: "🔄", color: "#f97316", bg: "#fff7ed" },
    { label: t.today, value: todayCount, icon: "📅", color: "#3b82f6", bg: "#eff6ff" },
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((s) => (
        <div key={s.label} className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-body d-flex align-items-center gap-3 p-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 48, height: 48, backgroundColor: s.bg, fontSize: 22 }}
              >
                {s.icon}
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: s.color }}>
                  {s.value}
                </div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
