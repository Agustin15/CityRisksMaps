import "./SearchPlace.css";
import iconClose from "../../../assets/img/close.png";
import iconSearch from "../../../assets/img/search.png";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { useMapControls } from "../../../contexts/MapContext";
import { searchByText, placeAutocompleteChanged } from "./functionsSearch";

export const SearchPlace = ({
  selectedPlace,
  setSelectedPlace,
  placesSearched,
  setPlacesSearched
}) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");
  const { userLocation, moreDetailsPlace, valueInput, setValueInput } =
    useMapControls();

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

    placeAutocompleteChanged(
      placeAutocomplete,
      setSelectedPlace,
      moreDetailsPlace,
      setValueInput
    );
  }, [setSelectedPlace, placeAutocomplete]);

  const handleClose = async () => {
    if (selectedPlace) {
      setSelectedPlace();
      setPlacesSearched();
    }
    setValueInput("");
  };

  const handleChange = (event) => {
    if (event.target.value.length == 0) {
      setSelectedPlace();
    }
    setValueInput(event.target.value);
  };

  const handleSearch = async () => {
    if (!placesSearched) {
      const places = await searchByText(
        userLocation,
        inputRef.current.value,
        moreDetailsPlace
      );

      if (places) setPlacesSearched(places);
    }
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
      <button
        onClick={handleSearch}
        className={valueInput.length > 0 ? "showSearch" : "hideSearch"}
      >
        <img src={iconSearch}></img>
      </button>
    </div>
  );
};
