import "./SearchPlace.css";
import iconClose from "../../../assets/img/close.png";
import iconSearch from "../../../assets/img/search.png";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { useMapControls } from "../../../contexts/MapContext";
import { geocodingPlaceByAddress } from "./GeocodingPlace";

export const SearchPlace = ({ onPlaceSelect }) => {
  const places = useMapsLibrary("places");
  const { moreDetailsPlace, valueInput, setValueInput } = useMapControls();
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);

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
        if (detailsPlace) {
          setValueInput(detailsPlace.displayName.text);
          onPlaceSelect(detailsPlace);
        }
      } else {
        const results = await geocodingPlaceByAddress(inputRef.current.value);
        if (results) {
          let detailsPlace = await moreDetailsPlace(results[0].place_id);
          onPlaceSelect(detailsPlace);
        }
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  const handleClose = async () => {
    onPlaceSelect();
    setValueInput("");
  };

  const handleChange = (event) => {
    if (event.target.value.length == 0) {
      onPlaceSelect();
    }
    setValueInput(event.target.value);
  };
  return (
    <div className="autocompleteContainer">
      <input
        value={valueInput}
        onChange={(event) => handleChange(event)}
        placeholder="Buscar ubicacion"
        ref={inputRef}
      />
      <button
        className={valueInput.length > 0 ? "showClose" : "hideClose"}
        onClick={() => handleClose()}
      >
        <img src={iconClose}></img>
      </button>
      <button className={valueInput.length > 0 ? "showSearch" : "hideSearch"}>
        <img src={iconSearch}></img>
      </button>
    </div>
  );
};
