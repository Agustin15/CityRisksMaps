import "./App.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ContainMap } from "./components/map/ContainMap";
import { MapProvider } from "./contexts/MapContext";
import { RoutesProvider } from "./contexts/routesContext/RoutesContext";
import { PhotosProvider } from "./contexts/PhotosContext";
import { ZoneCrimesProvider } from "./contexts/zoneCrimesContext/ZoneCrimesContext";
import { QuizesProvider } from "./contexts/quizesContext/QuizesContext";
import { SearchPlaceProvider } from "./contexts/SearchPlaceContext";
import { NavigationProvider } from "./contexts/NavigationContext";
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

function App() {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapProvider>
        <PhotosProvider>
          <ZoneCrimesProvider>
            <SearchPlaceProvider>
              <QuizesProvider>
                <RoutesProvider>
                  <NavigationProvider>
                    <ContainMap />
                  </NavigationProvider>
                </RoutesProvider>
              </QuizesProvider>
            </SearchPlaceProvider>
          </ZoneCrimesProvider>
        </PhotosProvider>
      </MapProvider>
    </APIProvider>
  );
}

export default App;
