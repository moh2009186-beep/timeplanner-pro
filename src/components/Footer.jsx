import { useLang } from "../utils/LanguageContext";

function Footer() {
  const { t } = useLang();

  return (
    <footer
      className="text-center border-top"
      style={{ backgroundColor: "#1e40af", padding: "18px 0" }}
    >
      <div className="container">
        <h3 className="mb-0 fw-bold" style={{ color: "#fff", fontSize: "1.2rem" }}>
          ischool L3
        </h3>
      </div>
    </footer>
  );
}

export default Footer;
