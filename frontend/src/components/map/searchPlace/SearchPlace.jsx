import "./SearchPlace.css";
import iconClose from "../../../assets/img/close.png";
import iconSearch from "../../../assets/img/search.png";
import { useEffect, useState } from "react";
import { useSearchPlace } from "../../../contexts/searchPlaceContext/SearchPlaceContext";
import { useMapControls } from "../../../contexts/MapContext";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext.jsx";
import { Suggestions } from "./suggestions/Suggestions.jsx";
import { getSuggestions } from "./functions.js";

export const SearchPlace = () => {
  const [suggestions, setSuggestions] = useState();
  const { userLocation } = useMapControls();
  const { handleClose, showRoutes } = useRoutes();

  const {
    setSelectedPlace,
    valueInput,
    setValueInput,
    inputRef,
    handleCleanInput,
    searchByText,
    loadingPlace,
    setLoadingPlace
  } = useSearchPlace();

  useEffect(() => {
    inputRef.current.value = valueInput;
    if (valueInput.length == 0 && showRoutes) handleClose(setSuggestions);
  }, [valueInput]);

  const handleSearch = async () => {
    const places = await searchByText();

    if (!places) {
      getSuggestions(
        userLocation,
        setSuggestions,
        setLoadingPlace,
        inputRef.current.value
      );
    }
  };

  const handleChangeInput = (event) => {
    if (event.target.value.length == 0) {
      setSelectedPlace();
      setSuggestions();
    }

    setValueInput(event.target.value);
  };

  return (
    <div
      onMouseLeave={() => {
        if (suggestions) setSuggestions();
      }}
    >
      <div className="autocompleteContainer">
        <input
          value={valueInput}
          onChange={(event) => handleChangeInput(event)}
          className={suggestions ? "inputFocus" : ""}
          placeholder="Buscar ubicacion"
          ref={inputRef}
        />

        {loadingPlace == false ? (
          <button
            className={valueInput.length > 0 ? "showClose" : "hideClose"}
            onClick={() => handleCleanInput(setSuggestions)}
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

      {suggestions && <Suggestions suggestions={suggestions} />}
    </div>
  );
};
