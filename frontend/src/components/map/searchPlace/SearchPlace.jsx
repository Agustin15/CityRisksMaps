import { getMontevideoGeoJson, getSuggestions } from "./functions.js";
import "./SearchPlace.css";
import iconClose from "../../../assets/img/close.png";
import iconAddress from "../../../assets/img/destinyAddress.png";
import iconSearch from "../../../assets/img/search.png";
import { useEffect, useState } from "react";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { useMapControls } from "../../../contexts/MapContext";

export const SearchPlace = () => {
  const [suggestions, setSuggestions] = useState();
  const { userLocation } = useMapControls();

  const {
    moreDetailsPlace,
    geocodingPlaceByAddress,
    setSelectedPlace,
    placesSearched,
    valueInput,
    setValueInput,
    inputRef,
    handleCleanInput,
    searchByText,
    loadingPlace
  } = useSearchPlace();

  useEffect(() => {
    inputRef.current.value = valueInput;
  }, [valueInput]);

  const handleSearch = async () => {
    const results = await geocodingPlaceByAddress(
      inputRef.current.value,
      getMontevideoGeoJson
    );
    if (results) {
      place = moreDetailsPlace(results[0].place_id, true);
    } else if (!placesSearched) {
      searchByText();
    }
  };

  const handleChangeInput = (event) => {
    if (event.target.value.length == 0) {
      setSelectedPlace();
      setSuggestions();
    } else getSuggestions(userLocation, setSuggestions, inputRef.current.value);

    setValueInput(event.target.value);
  };

  return (
    <>
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
            onClick={() => handleCleanInput(setSuggestions, suggestions)}
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
      {suggestions && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() =>
                moreDetailsPlace(suggestion.placePrediction.placeId)
              }
            >
              <img src={iconAddress}></img>
              <p>{suggestion.placePrediction.text.text}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
