import "./SearchPlace.css";
import iconClose from "../../../assets/img/close.png";
import iconSearch from "../../../assets/img/search.png";
import { useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useMapControls } from "../../../contexts/MapContext";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";

export const SearchPlace = () => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const places = useMapsLibrary("places");
  const { userLocation } = useMapControls();
  const {
    setSelectedPlace,
    placesSearched,
    placeAutocompleteChanged,
    valueInput,
    inputRef,
    handleChangeInput,
    handleCleanInput,
    searchByText,
    loadingPlace
  } = useSearchPlace();

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
    placeAutocompleteChanged(placeAutocomplete);
  }, [setSelectedPlace, placeAutocomplete]);


  useEffect(() => {
    inputRef.current.value = valueInput;
  }, [valueInput]);

  const handleSearch = async () => {
    if (!placesSearched) {
      searchByText(userLocation);
    }
  };
  return (
    <div className="autocompleteContainer">
      <input
        value={valueInput}
        onChange={(event) => handleChangeInput(event)}
        placeholder="Buscar ubicacion"
        ref={inputRef}
      />

      {loadingPlace == false ? (
        <button
          className={valueInput.length > 0 ? "showClose" : "hideClose"}
          onClick={() => handleCleanInput()}
        >
          <img src={iconClose}></img>
        </button>
      ) : (
        <span className="loader"></span>
      )}

      <button
        onClick={handleSearch}
        className={valueInput.length > 0 ? "showSearch" : "hideSearch"}
      >
        <img src={iconSearch}></img>
      </button>
    </div>
  );
};
