import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import iconSearch from "../../../assets/img/search.png";
import "./PlaceAutocomplete.css";
import { useMapControls } from "../../../contexts/MapContext";

export const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");
  const { moreDetailsPlace } = useMapControls();

  useEffect(() => {
    if (!places || !inputRef.current) return;

    setPlaceAutocomplete(
      new places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ["UY"] }
      })
    );
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", async () => {
      delete placeAutocomplete.getPlace()["utc_offset"];
      if (placeAutocomplete.getPlace()["opening_hours"])
        delete placeAutocomplete.getPlace()["opening_hours"]["open_now"];

      onPlaceSelect(
        await moreDetailsPlace(placeAutocomplete.getPlace().place_id)
      );
    });
  }, [onPlaceSelect, placeAutocomplete]);
  return (
    <div className="autocompleteContainer">
      <div className="iconMap">
        <img src={iconSearch}></img>
      </div>
      <input placeholder="Buscar ubicacion" ref={inputRef} />
    </div>
  );
};
