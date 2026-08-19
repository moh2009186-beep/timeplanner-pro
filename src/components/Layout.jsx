import { Outlet } from "react-router-dom";
import { useLang } from "../utils/LanguageContext";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout() {
  const { lang } = useLang();

  return (
    <div
      className="d-flex flex-column vh-100"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow-1 overflow-auto bg-light p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
