import "./PlaceAutocomplete.css";
import iconClose from "../../../assets/img/close.png";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { useMapControls } from "../../../contexts/MapContext";
import { geocodingPlace } from "./GeocodingPlace";

export const PlaceAutocomplete = ({ marker, onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");
  const { moreDetailsPlace, valueInput, setValueInput } = useMapControls();

  const handleClean = () => {
    inputRef.current.value = "";
    marker.position = null;
    setValueInput("");
    onPlaceSelect();
  };

  useEffect(() => {
    if (!places || !inputRef.current) return;

    setPlaceAutocomplete(
      new places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ["UY"] }
      })
    );
  }, [places]);

  useEffect(() => {
    inputRef.current.value = valueInput;
  }, [valueInput]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", async () => {
      let place_changed = placeAutocomplete.getPlace();

      if (place_changed.place_id) {
        let detailsPlace = await moreDetailsPlace(place_changed.place_id);
        setValueInput(detailsPlace.displayName.text);
        onPlaceSelect(detailsPlace);
      } else {
        const results = await geocodingPlace(inputRef.current.value);
        let detailsPlace = await moreDetailsPlace(results[0].place_id);

        onPlaceSelect(detailsPlace);
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocompleteContainer">
      {valueInput.length > 0 && (
        <button onClick={() => handleClean()}>
          <img src={iconClose}></img>
        </button>
      )}
      <input
        value={valueInput}
        onChange={(event) => setValueInput(event.target.value)}
        placeholder="Buscar ubicacion"
        ref={inputRef}
      />
    </div>
  );
};
