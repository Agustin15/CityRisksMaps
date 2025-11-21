import { APIProvider } from "@vis.gl/react-google-maps";
import "./App.css";
import { ContainMap } from "./components/map/ContainMap";
import { MapProvider } from "./contexts/MapContext";
import { RoutesProvider } from "./contexts/RoutesContext";
import { PhotosProvider } from "./contexts/PhotosContext";
import { ZoneCrimesProvider } from "./contexts/ZoneCrimesContext";
import { QuizesProvider } from "./contexts/QuizesContext";
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

function App() {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapProvider>
        <PhotosProvider>
          <ZoneCrimesProvider>
            <RoutesProvider>
              <QuizesProvider>
                <ContainMap />
              </QuizesProvider>
            </RoutesProvider>
          </ZoneCrimesProvider>
        </PhotosProvider>
      </MapProvider>
    </APIProvider>
  );
}

export default App;
