import { APIProvider } from "@vis.gl/react-google-maps";
import "./App.css";
import { ContainMap } from "./components/map/ContainMap";
import { MapProvider } from "./contexts/MapContext";
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

function App() {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapProvider>
        <ContainMap></ContainMap>
      </MapProvider>
    </APIProvider>
  );
}

export default App;
