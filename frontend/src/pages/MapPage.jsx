import { APIProvider } from "@vis.gl/react-google-maps";
import { ContainMap } from "../components/map/ContainMap";
import { MapProvider } from "../contexts/MapContext";
import { RoutesProvider } from "../contexts/routesContext/RoutesContext";
import { PhotosProvider } from "../contexts/PhotosContext";
import { NeighborhoodsCrimesProvider } from "../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { SearchPlaceProvider } from "../contexts/searchPlaceContext/SearchPlaceContext";
import { NavigationProvider } from "../contexts/navigationContext/NavigationContext";
import { NavigationStepProvider } from "../contexts/navigationContext/NavigationStepContext";
import { InteractionNeighborhoodsPolygonsProvider } from "../contexts/neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

export const MapPage = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapProvider>
        <PhotosProvider>
          <NeighborhoodsCrimesProvider>
            <InteractionNeighborhoodsPolygonsProvider>
              <SearchPlaceProvider>
                <RoutesProvider>
                  <NavigationProvider>
                    <NavigationStepProvider>
                      <ContainMap />
                    </NavigationStepProvider>
                  </NavigationProvider>
                </RoutesProvider>
              </SearchPlaceProvider>
            </InteractionNeighborhoodsPolygonsProvider>
          </NeighborhoodsCrimesProvider>
        </PhotosProvider>
      </MapProvider>
    </APIProvider>
  );
};
