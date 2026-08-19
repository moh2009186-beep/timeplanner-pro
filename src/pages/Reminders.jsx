import { useState, useEffect, useCallback } from "react";
import { useLang } from "../utils/LanguageContext";
import { useAuth } from "../utils/AuthContext";
import Task from "../utils/Task";
import { loadTasks, saveTasks } from "../utils/taskStorage";

function Reminders() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [now, setNow] = useState(new Date());
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dismissedReminders") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    setTasks(loadTasks(user?.id));
  }, [user]);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    localStorage.setItem("dismissedReminders", JSON.stringify(dismissed));
  }, [dismissed]);

  const getTimeInfo = useCallback((task) => {
    const taskTime = new Date(task.date + "T" + task.time);
    const diff = taskTime.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    const minutes = Math.floor(absDiff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diff > 0) {
      if (minutes < 60) return { label: t.dueSoon, time: minutes + " " + t.minutes, color: "#f59e0b", sort: minutes };
      if (hours < 24) return { label: t.upcoming, time: hours + " " + t.hours + ", " + (minutes % 60) + " " + t.minutes, color: "#3b82f6", sort: minutes };
      return { label: t.upcoming, time: days + " " + t.days, color: "#3b82f6", sort: minutes };
    }
    if (diff === 0) return { label: t.dueNow, time: t.dueNow, color: "#ef4444", sort: 0 };
    return { label: t.overdue, time: t.overdueBy + " " + (hours > 0 ? hours + " " + t.hours : minutes + " " + t.minutes), color: "#ef4444", sort: -minutes };
  }, [now, t]);

  const categorized = tasks.reduce((acc, task) => {
    if (task.status && (task.status === "Completed" || task.status === "\u0645\u0643\u062A\u0645\u0644")) return acc;
    const info = getTimeInfo(task);
    const group = info.sort >= 0 ? "upcoming" : "overdue";
    acc[group].push({ ...task, timeInfo: info });
    return acc;
  }, { upcoming: [], overdue: [] });

  categorized.upcoming.sort((a, b) => a.timeInfo.sort - b.timeInfo.sort);
  categorized.overdue.sort((a, b) => a.timeInfo.sort - b.timeInfo.sort);

  const filteredTasks = filter === "overdue" ? categorized.overdue
    : filter === "upcoming" ? categorized.upcoming
    : [...categorized.overdue, ...categorized.upcoming];

  const visibleTasks = filteredTasks.filter((task) => !dismissed.includes(task.id));

  const handleMarkComplete = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === taskId) {
          const done = lang === "ar" ? "\u0645\u0643\u062A\u0645\u0644" : "Completed";
          const newTask = new Task(task.id, task.title, task.description, task.date, task.time, task.category, done);
          return newTask;
        }
        return task;
      });
      const serialized = updated.map((tr) => [tr.id, tr.title, tr.description, tr.date, tr.time, tr.category, tr.status].join("|")).join("\n");
      localStorage.setItem(`tasks_${user?.id}`, serialized);
      return updated;
    });
  }, [lang]);

  const handleDismiss = useCallback((taskId) => {
    setDismissed((prev) => [...prev, taskId]);
  }, []);

  return (
    <div>
      <h4 className="fw-bold mb-4">{t.allReminders}</h4>

      <div className="d-flex gap-2 mb-3">
        {["upcoming", "overdue", "all"].map((f) => (
          <button key={f} className={`btn btn-sm rounded-pill px-3 fw-semibold ${filter === f ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter(f)}>
            {f === "upcoming" ? t.upcoming : f === "overdue" ? t.overdue : t.filterAll}
            {f === "overdue" && categorized.overdue.length > 0 && (
              <span className="badge bg-danger ms-1">{categorized.overdue.length}</span>
            )}
          </button>
        ))}
      </div>

      {visibleTasks.length === 0 && (
        <div className="text-center py-5 text-muted">
          <p style={{ fontSize: 48 }}>{filter === "overdue" ? "" : ""}</p>
          <p>{t.noTasksWithReminders}</p>
        </div>
      )}

      {visibleTasks.map((task) => (
        <div key={task.id} className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px", borderLeft: "4px solid " + task.timeInfo.color }}>
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge" style={{ backgroundColor: task.timeInfo.color, fontSize: "0.7rem" }}>
                    {task.timeInfo.label}
                  </span>
                  <span className="badge bg-light text-dark" style={{ fontSize: "0.7rem" }}>{task.category}</span>
                </div>
                <h6 className="fw-bold mb-1">{task.title}</h6>
                <p className="text-muted small mb-1">
                  {t.date}: {task.date} {t.at} {task.time}
                </p>
                <p className="small fw-semibold mb-0" style={{ color: task.timeInfo.color }}>
                  {task.timeInfo.time}
                </p>
              </div>
              <div className="d-flex gap-1">
                <button className="btn btn-success btn-sm rounded-pill px-2" style={{ fontSize: "0.75rem" }}
                  onClick={() => handleMarkComplete(task.id)}>
                  {t.markComplete}
                </button>
                <button className="btn btn-outline-secondary btn-sm rounded-pill px-2" style={{ fontSize: "0.75rem" }}
                  onClick={() => handleDismiss(task.id)}>
                  {t.dismiss}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reminders;
