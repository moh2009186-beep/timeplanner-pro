function Task(id, title, description, date, time, category) {
  this.id = id;
  this.title = title;
  this.description = description;
  this.date = date;
  this.time = time;
  this.category = category;
}

Task.prototype.getFormattedDate = function () {
  const d = new Date(this.date + "T" + this.time);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

Task.prototype.setTitle = function (newTitle) {
  if (!newTitle || newTitle.trim().length < 3) {
    throw new Error("Title must be at least 3 characters long.");
  }
  this.title = newTitle;
};

export default Task;
