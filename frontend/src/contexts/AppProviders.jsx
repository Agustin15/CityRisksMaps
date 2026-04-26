import { APIProvider } from "@vis.gl/react-google-maps";
import { MapProvider } from "./MapContext";
import { RoutesProvider } from "./routesContext/RoutesContext";
import { PhotosProvider } from "./PhotosContext";
import { NeighborhoodsCrimesProvider } from "./neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { SearchPlaceProvider } from "./searchPlaceContext/SearchPlaceContext";
import { NavigationProvider } from "./navigationContext/NavigationContext";
import { NavigationStepProvider } from "./navigationContext/NavigationStepContext";
import { InteractionNeighborhoodsPolygonsProvider } from "./neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

export const AppProviders = ({ children }) => {
  const providers = [
    MapProvider,
    PhotosProvider,
    NeighborhoodsCrimesProvider,
    InteractionNeighborhoodsPolygonsProvider,
    SearchPlaceProvider,
    RoutesProvider,
    NavigationProvider,
    NavigationStepProvider
  ];

  return (
    <APIProvider apiKey={API_KEY}>
      {providers.reduceRight(
        (acc, Provider) => (
          <Provider>{acc}</Provider>
        ),
        children
      )}
    </APIProvider>
  );
};
