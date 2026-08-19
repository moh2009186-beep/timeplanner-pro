import Task from "./Task";

function getTasksKey(userId) {
  return userId ? `tasks_${userId}` : "tasks";
}

export function loadTasks(userId) {
  try {
    const stored = localStorage.getItem(getTasksKey(userId));
    if (!stored) return [];
    return stored.split("\n").filter(Boolean).map((line) => {
      const parts = line.split("|");
      return new Task(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]);
    });
  } catch { return []; }
}

export function saveTasks(userId, tasks) {
  const serialized = tasks
    .map((tr) => [tr.id, tr.title, tr.description, tr.date, tr.time, tr.category, tr.status].join("|"))
    .join("\n");
  localStorage.setItem(getTasksKey(userId), serialized);
}
