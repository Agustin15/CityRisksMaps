import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { MapPage } from "./components/Pages/MapPage.jsx";
import { CookiesProvider } from "react-cookie";
import { WindowResizeProvider } from "./contexts/WindowResizeContext.jsx";
import { NotFoundPage } from "./components/pages/notFoundPage.jsx";
import { MaintenancePage } from "./components/pages/MaintenancePage.jsx";

function App() {
  return (
    <CookiesProvider>
      <WindowResizeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapPage />}></Route>
            <Route path="/*" element={<NotFoundPage />}></Route>
            <Route path="/Maintenance" element={<MaintenancePage />}></Route>
          </Routes>
        </BrowserRouter>
      </WindowResizeProvider>
    </CookiesProvider>
  );
}

export default App;
