import { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "../utils/LanguageContext";
import { useAuth } from "../utils/AuthContext";
import Task from "../utils/Task";
import { loadTasks, saveTasks } from "../utils/taskStorage";
import TaskCard from "../components/TaskCard";

const CATEGORIES_EN = ["All", "Personal", "Work", "Health", "Education"];
const CATEGORIES_AR = ["\u0627\u0644\u0643\u0644", "\u0634\u062E\u0635\u064A", "\u0639\u0645\u0644", "\u0635\u062D\u0629", "\u062A\u0639\u0644\u064A\u0645"];

function Tasks() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Personal");
  const [titleMsg, setTitleMsg] = useState("");
  const [dateMsg, setDateMsg] = useState("");
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
    return () => { if (successTimerRef.current) clearTimeout(successTimerRef.current); };
  }, []);

  const showSuccess = useCallback((msg) => {
    setSuccessMsg(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMsg(""), 3000);
  }, []);

  const validateTitle = useCallback((value) => {
    const regex = /^[A-Za-z0-9\s\u0600-\u06FF]{3,}$/;
    if (!value) { setTitleMsg(""); return false; }
    if (regex.test(value)) { setTitleMsg(t.titleIsValid); return true; }
    setTitleMsg(t.titleMustBe3Chars);
    return false;
  }, [t]);

  const validateDate = useCallback((selectedDate, selectedTime) => {
    if (!selectedDate) { setDateMsg(""); return false; }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate); selectedDay.setHours(0, 0, 0, 0);
    if (selectedDay < today) { setDateMsg(t.dateCannotBePast); return false; }
    if (selectedDay.getTime() === today.getTime() && selectedTime) {
      const now = new Date();
      const selected = new Date(selectedDate + "T" + selectedTime);
      if (selected < now) { setDateMsg(t.timeCannotBePast); return false; }
    }
    setDateMsg(t.titleIsValid);
    return true;
  }, [t]);

  const handleAddTask = useCallback(() => {
    try {
      const isTitleValid = validateTitle(title);
      const isDateValid = validateDate(date, time);
      if (!isTitleValid) throw new Error(t.invalidTitle);
      if (!date) throw new Error(t.dateRequired);
      if (!time) throw new Error(t.timeRequired);
      if (!isDateValid) throw new Error(t.invalidDateTime);
      const statusVal = lang === "ar" ? "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631" : "Pending";
      const catVal = lang === "ar"
        ? { Personal: "\u0634\u062E\u0635\u064A", Work: "\u0639\u0645\u0644", Health: "\u0635\u062D\u0629", Education: "\u062A\u0639\u0644\u064A\u0645" }[category] || category
        : category;
      const newTask = new Task(Date.now().toString(), title, description, date, time, catVal, statusVal);
      setTasks((prev) => [...prev, newTask]);
      showSuccess(t.taskAddedSuccess);
      setTitle(""); setDescription(""); setDate(""); setTime("");
      setCategory(lang === "ar" ? "\u0634\u062E\u0635\u064A" : "Personal");
      setTitleMsg(""); setDateMsg(""); setShowForm(false);
    } catch (err) { alert(err.message); } finally {}
  }, [title, description, date, time, category, validateTitle, validateDate, showSuccess, t, lang]);

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
      if (window.confirm(t.confirmDelete)) setTasks((prev) => prev.filter((tr) => tr.id !== id));
    }
    if (action === "edit") {
      const task = tasks.find((tr) => tr.id === id);
      if (task) { setEditingId(id); setEditValues({ title: task.title, description: task.description, date: task.date, time: task.time, category: task.category }); }
    }
    if (action === "save") {
      try {
        const updated = new Task(id, editValues.title, editValues.description, editValues.date, editValues.time, editValues.category);
        updated.setTitle(editValues.title);
        setTasks((prev) => prev.map((tr) => (tr.id === id ? updated : tr)));
        setEditingId(null);
      } catch (err) { alert(err.message); }
    }
    if (action === "cancel") setEditingId(null);
  }, [tasks, editValues, t]);

  const handleEditChange = useCallback((field, value) => setEditValues((prev) => ({ ...prev, [field]: value })), []);
  const handleEditKeyDown = useCallback((e) => { if (e.key === "Escape") setEditingId(null); }, []);

  const categories = lang === "ar" ? CATEGORIES_AR : CATEGORIES_EN;
  const filterVal = filter === "All" || filter === "\u0627\u0644\u0643\u0644" ? null : filter;
  const filteredTasks = filterVal ? tasks.filter((tr) => tr.category === filterVal) : tasks;
  const stats = tasks.reduce((acc, task) => { acc[task.category] = (acc[task.category] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">{t.allTasks}</h4>
        <button className="btn btn-primary rounded-pill px-3 py-1 fw-semibold small" onClick={() => setShowForm(!showForm)}>
          {t.addTask}
        </button>
      </div>

      {successMsg && <div className="alert alert-success py-2 mb-3" style={{ borderRadius: "10px" }}>{successMsg}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "14px" }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">{t.newTask}</h6>
            <div onKeyDown={handleFormKeyDown}>
              <input ref={titleRef} type="text" className="form-control mb-2" placeholder={t.whatNeedsToBeDone} value={title} onChange={(e) => { setTitle(e.target.value); validateTitle(e.target.value); }} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
              {titleMsg && <small className={titleMsg === t.titleIsValid ? "text-success" : "text-danger"}>{titleMsg}</small>}
              <div className="row g-2 mb-2 mt-1">
                <div className="col-md-4"><input type="date" className="form-control" value={date} onChange={(e) => { setDate(e.target.value); validateDate(e.target.value, time); }} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} /></div>
                <div className="col-md-4"><input type="time" className="form-control" value={time} onChange={(e) => { setTime(e.target.value); validateDate(date, e.target.value); }} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} /></div>
                <div className="col-md-4">
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }}>
                    <option value="Personal">{t.personal}</option><option value="Work">{t.work}</option><option value="Health">{t.health}</option><option value="Education">{t.education}</option>
                  </select>
                </div>
              </div>
              {dateMsg && <small className={dateMsg === t.titleIsValid ? "text-success" : "text-danger"}>{dateMsg}</small>}
              <textarea className="form-control mb-2 mt-1" placeholder={t.descriptionOptional} value={description} onChange={(e) => setDescription(e.target.value)} rows="2" style={{ borderRadius: "10px", border: "2px solid #e8ecf0" }} />
              <div className="d-flex gap-2">
                <button className="btn btn-primary rounded-pill px-3" onClick={handleAddTask}>{t.add}</button>
                <button className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowForm(false)}>{t.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <select className="form-select form-select-sm" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "auto", borderRadius: "10px", border: "2px solid #e8ecf0" }}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {Object.entries(stats).map(([cat, count]) => (
          <span key={cat} className="badge bg-light text-dark border" style={{ borderRadius: "20px", padding: "6px 14px" }}>{cat}: {count}</span>
        ))}
      </div>

      <div onClick={handleListClick}>
        {filteredTasks.length === 0 && <p className="text-muted text-center py-4">{t.noTasksFound}</p>}
        {filteredTasks.map((task) => {
          if (editingId === task.id) {
            return (
              <div key={task.id} className="card mb-3 border-0 shadow-sm" style={{ borderRadius: "14px" }}>
                <div className="card-body p-3">
                  {["title", "description", "date", "time", "category"].map((field) => (
                    <div key={field} className="mb-2">
                      <label className="form-label text-capitalize fw-semibold small">{t[field]}:</label>
                      {field === "category" ? (
                        <select className="form-select form-select-sm" value={editValues[field]} onChange={(e) => handleEditChange(field, e.target.value)}>
                          <option value="Personal">{t.personal}</option><option value="Work">{t.work}</option><option value="Health">{t.health}</option><option value="Education">{t.education}</option>
                        </select>
                      ) : <input type={field === "date" ? "date" : field === "time" ? "time" : "text"} className="form-control form-control-sm" value={editValues[field]} onChange={(e) => handleEditChange(field, e.target.value)} onKeyDown={handleEditKeyDown} />}
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
    </div>
  );
}

export default Tasks;
