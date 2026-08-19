import { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "../utils/LanguageContext";
import { useAuth } from "../utils/AuthContext";
import Task from "../utils/Task";
import { loadTasks, saveTasks } from "../utils/taskStorage";
import { playBeep } from "../utils/sound";
import TaskCard from "../components/TaskCard";
import StatsBar from "../components/StatsBar";
import CalendarWidget from "../components/CalendarWidget";
import ScheduleWidget from "../components/ScheduleWidget";
import PomodoroTimer from "../components/PomodoroTimer";

function Home() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Personal");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const successTimerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (showForm && titleRef.current) titleRef.current.focus();
  }, [showForm]);

  useEffect(() => {
    setTasks(loadTasks(user?.id));
  }, [user]);

  useEffect(() => {
    saveTasks(user?.id, tasks);
  }, [tasks, user]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "tasks" && e.newValue) {
        const lines = e.newValue.split("\n").filter(Boolean);
        const loaded = lines.map((line) => {
          const parts = line.split("|");
          return new Task(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]);
        });
        setTasks(loaded);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        const taskDateTime = new Date(task.date + "T" + task.time);
        if (
          taskDateTime.getFullYear() === now.getFullYear() &&
          taskDateTime.getMonth() === now.getMonth() &&
          taskDateTime.getDate() === now.getDate() &&
          taskDateTime.getHours() === now.getHours() &&
          taskDateTime.getMinutes() === now.getMinutes()
        ) {
          playBeep();
          alert('Reminder: "' + task.title + '" is due now!');
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [tasks]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const showSuccess = useCallback((msg) => {
    setSuccessMsg(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMsg(""), 3000);
  }, []);

  const handleAddTask = useCallback(() => {
    try {
      if (!title.trim()) throw new Error(t.taskTitleRequired);
      if (!time) throw new Error(t.timeRequired);
      const statusVal = lang === "ar" ? "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631" : "Pending";
      const catVal = lang === "ar"
        ? { Personal: "\u0634\u062E\u0635\u064A", Work: "\u0639\u0645\u0644", Health: "\u0635\u062D\u0629", Education: "\u062A\u0639\u0644\u064A\u0645" }[category] || category
        : category;

      const todayStr = new Date().toISOString().split("T")[0];
      const newTask = new Task(Date.now().toString(), title.trim(), "", todayStr, time, catVal, statusVal);
      setTasks((prev) => [...prev, newTask]);
      showSuccess(t.taskAddedSuccess);
      setTitle("");
      setTime("");
      setCategory(lang === "ar" ? "\u0634\u062E\u0635\u064A" : "Personal");
      setErrorMsg("");
      setShowForm(false);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  }, [title, time, category, t, lang, showSuccess]);

  const handleFormKeyDown = useCallback((e) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddTask(); }
    if (e.key === "Escape") setShowForm(false);
  }, [handleAddTask]);

  const handleListClick = useCallback((e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === "delete") {
      if (window.confirm(t.confirmDelete)) {
        setTasks((prev) => prev.filter((tr) => tr.id !== id));
      }
    }
    if (action === "edit") {
      const task = tasks.find((tr) => tr.id === id);
      if (task) {
        setEditingId(id);
        setEditValues({ title: task.title, description: task.description, date: task.date, time: task.time, category: task.category });
      }
    }
    if (action === "save") {
      const val = editValues;
      try {
        const updated = new Task(id, val.title, val.description, val.date, val.time, val.category);
        updated.setTitle(val.title);
        setTasks((prev) => prev.map((tr) => (tr.id === id ? updated : tr)));
        setEditingId(null);
      } catch (err) { alert(err.message); }
    }
    if (action === "cancel") setEditingId(null);
  }, [tasks, editValues, t]);

  const handleEditChange = useCallback((field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEditKeyDown = useCallback((e) => {
    if (e.key === "Escape") setEditingId(null);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTasks = tasks.filter((tr) => {
    const d = new Date(tr.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  return (
    <div>
      <StatsBar tasks={tasks} />

      {successMsg && (
        <div className="alert alert-success py-2 mb-3" style={{ borderRadius: "10px" }}>
          {successMsg}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8" onClick={handleListClick}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{t.todaysTasks}</h5>
            <button
              className="btn btn-primary rounded-pill px-3 py-1 fw-semibold small"
              onClick={() => setShowForm(!showForm)}
            >
              {t.addTask}
            </button>
          </div>

          {showForm && (
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "14px" }}>
              <div className="card-body p-3">
                {errorMsg && <div className="text-danger small mb-2 fw-medium">{errorMsg}</div>}
                <div onKeyDown={handleFormKeyDown}>
                  <input
                    ref={titleRef}
                    type="text"
                    className="form-control mb-2"
                    placeholder={t.whatNeedsToBeDone}
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrorMsg(""); }}
                    style={{ borderRadius: "10px", border: "2px solid #e8ecf0", backgroundColor: "#f8f9fb" }}
                  />
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="time"
                      className="form-control"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={{ borderRadius: "10px", border: "2px solid #e8ecf0", backgroundColor: "#f8f9fb" }}
                    />
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ borderRadius: "10px", border: "2px solid #e8ecf0", backgroundColor: "#f8f9fb", maxWidth: 150 }}
                    >
                      <option value="Personal">{t.personal}</option>
                      <option value="Work">{t.work}</option>
                      <option value="Health">{t.health}</option>
                      <option value="Education">{t.education}</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={handleAddTask}>{t.add}</button>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => setShowForm(false)}>{t.cancel}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {todayTasks.length === 0 && !showForm && (
            <div className="text-center py-4 text-muted">
              <p style={{ fontSize: 36 }}>📋</p>
              <p className="small">{t.noTasksYet}</p>
            </div>
          )}

          {todayTasks.map((task) => {
            if (editingId === task.id) {
              return (
                <div key={task.id} className="card mb-3 border-0 shadow-sm" style={{ borderRadius: "14px" }}>
                  <div className="card-body p-3">
                    {["title", "time", "category"].map((field) => (
                      <div key={field} className="mb-2">
                        <label className="form-label text-capitalize fw-semibold small">{t[field]}:</label>
                        {field === "category" ? (
                          <select className="form-select form-select-sm" value={editValues[field]} onChange={(e) => handleEditChange(field, e.target.value)}>
                            <option value="Personal">{t.personal}</option>
                            <option value="Work">{t.work}</option>
                            <option value="Health">{t.health}</option>
                            <option value="Education">{t.education}</option>
                          </select>
                        ) : (
                          <input type={field === "time" ? "time" : "text"} className="form-control form-control-sm" value={editValues[field]} onChange={(e) => handleEditChange(field, e.target.value)} onKeyDown={handleEditKeyDown} />
                        )}
                      </div>
                    ))}
                    <button className="btn btn-success btn-sm rounded-pill px-3 me-2" data-action="save" data-id={task.id}>{t.save}</button>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" data-action="cancel" data-id={task.id}>{t.cancel}</button>
                  </div>
                </div>
              );
            }
            return <TaskCard key={task.id} task={task} />;
          })}
        </div>

        <div className="col-lg-4">
          <CalendarWidget />
          <ScheduleWidget />
          <PomodoroTimer />
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body p-3">
              <h6 className="fw-bold mb-2">{t.settings}</h6>
              <div className="form-check form-switch mb-1">
                <input className="form-check-input" type="checkbox" id="notif" defaultChecked />
                <label className="form-check-label small" htmlFor="notif">{t.enableNotifications}</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="sound" defaultChecked />
                <label className="form-check-label small" htmlFor="sound">{t.reminderSounds}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
