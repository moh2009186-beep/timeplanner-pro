import { useState, useEffect, useMemo, useCallback } from "react";
import { useLang } from "../utils/LanguageContext";
import { useAuth } from "../utils/AuthContext";
import Task from "../utils/Task";
import { loadTasks } from "../utils/taskStorage";

function Calendar() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setTasks(loadTasks(user?.id));
  }, [user]);

  const monthNames = t.monthNames || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = t.dayNames || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    });
    return map;
  }, [tasks]);

  const formatDate = useCallback((y, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }, []);

  const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : [];

  const isToday = useCallback((d) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  }, [year, month]);

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDate(null); };
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDate(null); };
  const goToday = () => { setCurrentDate(new Date()); setSelectedDate(formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())); };

  const statusColor = (status) => {
    if (status === "Completed" || status === "\u0645\u0643\u062A\u0645\u0644") return "#22c55e";
    if (status === "In Progress" || status === "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630") return "#3b82f6";
    return "#f59e0b";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">{t.calendarTitle}</h4>
        <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={goToday}>{t.today}</button>
      </div>

      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: 32, height: 32 }} onClick={prevMonth}>&#8249;</button>
            <h5 className="fw-bold mb-0">{monthNames[month]} {year}</h5>
            <button className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: 32, height: 32 }} onClick={nextMonth}>&#8250;</button>
          </div>
          <div className="row g-0 text-center mb-1">
            {dayNames.map((d) => (
              <div key={d} className="col fw-semibold text-muted small py-1">{d}</div>
            ))}
          </div>
          <div className="row g-0">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={"empty-" + i} className="col" />;
              const dateStr = formatDate(year, month, day);
              const hasTasks = tasksByDate[dateStr] && tasksByDate[dateStr].length > 0;
              const selected = selectedDate === dateStr;
              const today = isToday(day);
              return (
                <div key={day} className="col" style={{ padding: 2 }}>
                  <button
                    className="btn w-100 position-relative"
                    style={{
                      fontSize: "0.8rem", padding: "6px 0", borderRadius: "8px",
                      backgroundColor: selected ? "#3b82f6" : today ? "#e0e7ff" : "transparent",
                      color: selected ? "#fff" : today ? "#3b82f6" : "#333",
                      fontWeight: today || selected ? 700 : 400,
                      border: selected ? "2px solid #3b82f6" : "2px solid transparent",
                    }}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    {day}
                    {hasTasks && <span className="position-absolute" style={{ bottom: 2, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", backgroundColor: selected ? "#fff" : "#3b82f6" }} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "14px" }}>
          <div className="card-body p-3">
            <h6 className="fw-bold mb-3">{t.tasksOn} {selectedDate}</h6>
            {selectedTasks.length === 0 && <p className="text-muted small mb-0">{t.noTasksOnThisDay}</p>}
            {selectedTasks.map((task) => (
              <div key={task.id} className="d-flex align-items-center gap-3 p-2 rounded-3 mb-2" style={{ backgroundColor: "#f8f9fb" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: statusColor(task.status), flexShrink: 0 }} />
                <div className="flex-grow-1">
                  <p className="mb-0 fw-semibold small">{task.title}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{task.time} &middot; {task.category}</p>
                </div>
                <span className="badge" style={{ backgroundColor: statusColor(task.status), fontSize: "0.65rem" }}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
