const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import styles from "./MenuRoutes.module.css";
import iconDestiny from "../../../assets/img/destinyAddress.png";
import iconOrigin from "../../../assets/img/origin.png";
import { OptionsAddress } from "./optionsAddress/OptionsAddress.jsx";
import { useRoutes } from "../../../contexts/RoutesContext";
import { Transports } from "./transports/Transports";
import { useMapControls } from "../../../contexts/MapContext.jsx";

export const MenuRoute = () => {
  const { destiny, setShowMenuRoutes } = useRoutes();
  const { userLocation } = useMapControls();
  const [suggestions, setSuggestions] = useState();

  const handleChange = async (value) => {
    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "X-Goog-Api-Key": API_KEY
          },
          body: JSON.stringify({
            input: value,
            regionCode: "UY",
            locationBias: {
              circle: {
                center: {
                  latitude: userLocation.lat,
                  longitude: userLocation.lng
                },
                radius: 10000.0
              }
            }
          })
        }
      );
      const result = await response.json();
      setSuggestions(result.suggestions);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.menuRoute}>
      <div className={styles.close}>
        <button onClick={() => setShowMenuRoutes(false)}>x</button>
      </div>
      <Transports></Transports>
      <div className={styles.column}>
        <div className={styles.origin}>
          <label>Origen:</label>
          <div className={styles.row}>
            <img src={iconOrigin}></img>
            <input
              onChange={(event) => handleChange(event.target.value)}
              type="text"
            ></input>
          </div>
        </div>
        <div className={styles.destiny}>
          <label>Destino:</label>
          <div className={styles.row}>
            <img src={iconDestiny}></img>
            <input type="text" value={destiny.address}></input>
          </div>
        </div>
      </div>
      <OptionsAddress suggestions={suggestions} />
    </div>
  );
};
