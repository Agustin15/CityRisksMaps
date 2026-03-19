import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { MapPage } from "./components/Pages/MapPage.jsx";
import { WindowResizeProvider } from "./contexts/WindowResizeContext.jsx";
import { NotFoundPage } from "./components/pages/notFoundPage.jsx";
import { LoginAdmin } from "./components/loginAdmin/LoginAdmin.jsx";
import { Departments } from "./components/admin/departments/Departments.jsx";
import { CookiesProvider } from "react-cookie";
import { CrudProvider } from "./contexts/adminContext/CrudContext.jsx";

function App() {
  return (
    <WindowResizeProvider>
      <CookiesProvider>
        <CrudProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MapPage />}></Route>
              <Route path="/*" element={<NotFoundPage />}></Route>
              <Route path="/admin/login" element={<LoginAdmin />}></Route>
              <Route
                path="/admin/departamentos"
                element={<Departments />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </CrudProvider>
      </CookiesProvider>
    </WindowResizeProvider>
  );
}

export default App;
