import { useLang } from "../utils/LanguageContext";

function About() {
  const { t } = useLang();

  return (
    <div>
      <h2 className="fw-bold mb-4">{t.aboutTaskPlanner}</h2>
      <p className="lead text-muted mb-4">{t.aboutDescription}</p>
      <div className="row g-3">
        <div className="col-md-6"><div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px" }}><div className="card-body"><h5 className="card-title">{t.taskManagement}</h5><p className="card-text text-muted small">{t.taskManagementDesc}</p></div></div></div>
        <div className="col-md-6"><div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px" }}><div className="card-body"><h5 className="card-title">{t.realTimeValidation}</h5><p className="card-text text-muted small">{t.realTimeValidationDesc}</p></div></div></div>
        <div className="col-md-6"><div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px" }}><div className="card-body"><h5 className="card-title">{t.remindersFeature}</h5><p className="card-text text-muted small">{t.remindersDesc}</p></div></div></div>
        <div className="col-md-6"><div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px" }}><div className="card-body"><h5 className="card-title">{t.dataPersistence}</h5><p className="card-text text-muted small">{t.dataPersistenceDesc}</p></div></div></div>
      </div>
      <h4 className="mt-4 fw-bold">{t.technologies}</h4>
      <p className="text-muted">{t.technologiesDesc}</p>
    </div>
  );
}

export default About;
