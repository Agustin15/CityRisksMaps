import "./PlaceAutocomplete.css";
import iconClean from "../../../assets/img/clean.png";
import iconSearch from "../../../assets/img/search.png";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { useMapControls } from "../../../contexts/MapContext";
import { geocodingPlace } from "./GeocodingPlace";

export const PlaceAutocomplete = ({ marker, onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");
  const { moreDetailsPlace, valueInput, setValueInput } = useMapControls();

  const handleClick = () => {
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
      <button onClick={() => handleClick()}>
        <span>{valueInput.length > 0 ? "Borrar": "Buscar"}</span>
      </button>

      <input
        value={valueInput}
        onChange={(event) => setValueInput(event.target.value)}
        placeholder="Buscar ubicacion"
        ref={inputRef}
      />
    </div>
  );
};
