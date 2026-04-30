import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { MapPage } from "./Pages/MapPage.jsx";
import { WindowResizeProvider } from "./contexts/WindowResizeContext.jsx";
import { ActivateUserProvider } from "./contexts/adminContext/ActivateUserContext.jsx";
import { CrudProvider } from "./contexts/adminContext/CrudContext.jsx";
import { AuthProvider } from "./contexts/adminContext/AuthContext.jsx";
import { NotFoundPage } from "./pages/notFoundPage.jsx";
import { Forbidden } from "./pages/Forbidden.jsx";
import { Unauthorized } from "./pages/Unauthorized.jsx";
import { LoginAdmin } from "./components/loginAdmin/LoginAdmin.jsx";
import { Departments } from "./components/admin/departments/Departments.jsx";
import { Neighborhoods } from "./components/admin/neighborhoods/Neighborhoods.jsx";
import { Populations } from "./components/admin/populations/Populations.jsx";
import { CategoryCrimes } from "./components/admin/categoryCrimes/CategoryCrimes.jsx";
import { Rols } from "./components/admin/rols/Rols.jsx";
import { Users } from "./components/admin/users/Users.jsx";
import { ActivateUser } from "./components/admin/activateUser/ActivateUser.jsx";
import { EmailConfirmedPage } from "./pages/EmailConfirmedPage.jsx";
import { NeighborhoodsCrimes } from "./components/admin/neighborhoodsCrimes/NeighborhoodsCrimes.jsx";
import { EditProfile } from "./components/admin/editProfile/EditProfile.jsx";

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
                path="/admin/barrios/departamento/:departmentName"
                element={<Neighborhoods />}
              ></Route>

              <Route
                path="/admin/poblaciones"
                element={<Populations />}
              ></Route>
              <Route
                path="/admin/poblaciones/barrio/:neighborhoodName"
                element={<Populations />}
              ></Route>

              <Route
                path="/admin/categorias-delitos/"
                element={<CategoryCrimes />}
              ></Route>

              <Route
                path="/admin/indice-delitos-barrios/"
                element={<NeighborhoodsCrimes />}
              ></Route>

              <Route path="/admin/roles/" element={<Rols />}></Route>
              <Route path="/admin/usuarios/" element={<Users />}></Route>
              <Route
                path="/admin/usuarios/rol/:roleName"
                element={<Users />}
              ></Route>
              <Route
                path="/admin/permiso-denegado/"
                element={<Forbidden />}
              ></Route>
              <Route
                path="/admin/no-autorizado/"
                element={<Unauthorized />}
              ></Route>
              <Route
                path="/admin/editar-perfil/"
                element={<EditProfile />}
              ></Route>
              <Route
                path="/admin/activar-usuario/:token"
                element={
                  <ActivateUserProvider>
                    <ActivateUser />
                  </ActivateUserProvider>
                }
              ></Route>
              <Route
                path="/admin/confirmar-correo/:token"
                element={<EmailConfirmedPage />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </CrudProvider>
      </AuthProvider>
    </WindowResizeProvider>
  );
}

export default App;
