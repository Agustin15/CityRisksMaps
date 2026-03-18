import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { MapPage } from "./components/Pages/MapPage.jsx";
import { WindowResizeProvider } from "./contexts/WindowResizeContext.jsx";
import { NotFoundPage } from "./components/pages/notFoundPage.jsx";
import { LoginAdmin } from "./components/loginAdmin/LoginAdmin.jsx";
import { Departments } from "./components/admin/departments/Departments.jsx";
import { AuthProvider } from "./contexts/adminContext/AuthContext.jsx";

function App() {
  return (
    <WindowResizeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </WindowResizeProvider>
  );
}

export default App;
