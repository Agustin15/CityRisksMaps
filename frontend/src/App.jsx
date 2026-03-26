import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { MapPage } from "./Pages/MapPage.jsx";
import { WindowResizeProvider } from "./contexts/WindowResizeContext.jsx";
import { CrudProvider } from "./contexts/adminContext/CrudContext.jsx";
import { AuthProvider } from "./contexts/adminContext/AuthContext.jsx";
import { NotFoundPage } from "./pages/notFoundPage.jsx";
import { LoginAdmin } from "./components/loginAdmin/LoginAdmin.jsx";
import { Departments } from "./components/admin/departments/Departments.jsx";
import { Neighborhoods } from "./components/admin/neighborhoods/Neighborhoods.jsx";
import { Populations } from "./components/admin/populations/Populations.jsx";

function App() {
  return (
    <WindowResizeProvider>
      <AuthProvider>
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
              <Route path="/admin/barrios" element={<Neighborhoods />}></Route>
              <Route
                path="/admin/barrios/departamento/:controller/:name"
                element={<Neighborhoods />}
              ></Route>

              <Route
                path="/admin/poblaciones"
                element={<Populations />}
              ></Route>
              <Route
                path="/admin/poblaciones/barrio/:controller/:name"
                element={<Populations />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </CrudProvider>
      </AuthProvider>
    </WindowResizeProvider>
  );
}

export default App;
