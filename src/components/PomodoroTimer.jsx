import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "../utils/LanguageContext";
import { playBeep } from "../utils/sound";

function PomodoroTimer() {
  const { t } = useLang();
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playBeep();
            alert(t.pomodoro + " complete!");
            return duration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, duration, t]);

  const handleDurationChange = useCallback((e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) return;
    setDuration(val);
    setSeconds(val * 60);
    setIsRunning(false);
  }, []);

  const handleStart = useCallback(() => setIsRunning(true), []);
  const handlePause = useCallback(() => setIsRunning(false), []);
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSeconds(duration * 60);
  }, [duration]);

  const totalSeconds = duration * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - seconds) / totalSeconds) * 100 : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "16px" }}>
      <div className="card-body p-3 text-center">
        <h6 className="fw-bold mb-3">{t.pomodoro}</h6>
        <div className="position-relative d-inline-block mb-3">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="#e9ecef" strokeWidth="8" />
            <circle
              cx="65" cy="65" r={radius} fill="none" stroke="#ef4444" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div
            className="position-absolute top-50 start-50 translate-middle fw-bold"
            style={{ fontSize: "1.6rem", fontFamily: "monospace" }}
          >
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <label className="small fw-semibold mb-0">{t.workDuration}:</label>
          <input
            type="number" min="1" max="180" value={duration}
            onChange={handleDurationChange} disabled={isRunning}
            className="form-control form-control-sm text-center"
            style={{ width: 70, borderRadius: "8px", border: "2px solid #e8ecf0" }}
          />
        </div>
        <div className="d-flex gap-2 justify-content-center">
          {!isRunning ? (
            <button className="btn btn-danger btn-sm px-3" onClick={handleStart}>{t.start}</button>
          ) : (
            <button className="btn btn-warning btn-sm px-3" onClick={handlePause}>{t.pause}</button>
          )}
          <button className="btn btn-outline-secondary btn-sm px-3" onClick={handleReset}>{t.reset}</button>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;
