import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { MapPage } from "./components/Pages/MapPage.jsx";
import { CookiesProvider } from "react-cookie";
import { WindowResizeProvider } from "./contexts/WindowResizeContext.jsx";
import { NotFoundPage } from "./components/pages/notFoundPage.jsx";

function App() {
  return (
    <CookiesProvider>
      <WindowResizeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapPage />}></Route>
            <Route path="/*" element={<NotFoundPage />}></Route>
          </Routes>
        </BrowserRouter>
      </WindowResizeProvider>
    </CookiesProvider>
  );
}

export default App;
