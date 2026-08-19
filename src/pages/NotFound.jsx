import { Link } from "react-router-dom";
import { useLang } from "../utils/LanguageContext";

function NotFound() {
  const { t } = useLang();
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h3 className="mb-3">{t.pageNotFound}</h3>
      <p className="text-muted mb-4">{t.pageNotFoundDesc}</p>
      <Link to="/" className="btn btn-primary rounded-pill px-4">{t.goBackHome}</Link>
    </div>
  );
}

export default NotFound;
