import { APIProvider } from "@vis.gl/react-google-maps";
import { ContainMap } from "../../components/map/ContainMap";
import { MapProvider } from "../../contexts/MapContext";
import { RoutesProvider } from "../../contexts/routesContext/RoutesContext";
import { PhotosProvider } from "../../contexts/PhotosContext";
import { ZoneCrimesProvider } from "../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { QuizesProvider } from "../../contexts/quizesContext/QuizesContext";
import { SearchPlaceProvider } from "../../contexts/searchPlaceContext/SearchPlaceContext";
import { NavigationProvider } from "../../contexts/navigationContext/NavigationContext";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

export const MapPage = () => {
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
};
