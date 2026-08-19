import { useState } from "react";
import { useLang } from "../utils/LanguageContext";

function CalendarWidget() {
  const { lang, t } = useLang();
  const [currentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const monthNames = t.monthNames || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = t.dayNames || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const rows = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "16px", overflow: "hidden" }}>
      <div className="card-body p-0">
        <div className="p-3 text-center" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
          <div className="text-white fw-bold" style={{ fontSize: "1.8rem", lineHeight: 1 }}>
            {today.getDate()}
          </div>
          <div className="text-white-50 small mt-1">
            {monthNames[month]} {year}
          </div>
        </div>
        <div className="p-2">
          <table className="table table-borderless mb-0 text-center" style={{ fontSize: "0.75rem" }}>
            <thead>
              <tr>
                {dayNames.map((d) => (
                  <th key={d} className="text-muted fw-semibold py-1" style={{ fontSize: "0.65rem" }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((day, ci) => {
                    if (day === null) return <td key={ci} />;
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    return (
                      <td key={ci} className="py-1">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: 30,
                            height: 30,
                            fontSize: "0.75rem",
                            fontWeight: isToday ? 700 : 400,
                            backgroundColor: isToday ? "#3b82f6" : "transparent",
                            color: isToday ? "#fff" : "#495057",
                            transition: "all 0.15s",
                          }}
                        >
                          {day}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CalendarWidget;
