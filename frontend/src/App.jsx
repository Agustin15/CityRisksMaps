import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { MapPage } from "./components/Pages/MapPage.jsx";
import { WindowResizeProvider } from "./contexts/WindowResizeContext.jsx";
import { NotFoundPage } from "./components/pages/notFoundPage.jsx";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <WindowResizeProvider>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapPage />}></Route>
            <Route path="/*" element={<NotFoundPage />}></Route>
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </WindowResizeProvider>
  );
}

export default App;
