import styles from "./Tools.module.css";
import iconMap from "../../../assets/img/map.png";
import { OptionsCrimes } from "../optionsCrimes/OptionsCrimes";
import { PlaceDetails } from "../placeDetails/PlaceDetails.jsx";
import { PlacesSearched } from "../placesSearched/PlacesSearched";
import { MenuRoute } from "../menuRoute/MenuRoute";
import { PhotosList } from "../placeDetails/photosList/photosList";
import { Modal } from "../modal/Modal";
import { FormAddQuizProvider } from "../../../contexts/quizesContext/FormAddQuizContext";
import { FormAdd } from "../quizes/formAdd/FormAdd";
import { ListQuizesProvider } from "../../../contexts/quizesContext/ListQuizesContext";
import { ListUserQuizes } from "../quizes/listUserQuizes/ListUserQuizes";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { useRoutes } from "../../../contexts/RoutesContext";
import { usePhotosPlace } from "../../../contexts/PhotosContext";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";

export const Tools = () => {
  const { newQuiz, showListQuizes } = useQuizes();
  const { showPhotos } = usePhotosPlace();
  const { showMenuRoutes } = useRoutes();
  const { selectedPlace, placesSearched } = useSearchPlace();

  return (
    <>
      <OptionsCrimes />

      {selectedPlace && <PlaceDetails place={selectedPlace} />}

      {placesSearched && <PlacesSearched />}

      {!placesSearched && !selectedPlace && (
        <div className={styles.placeNotSelected}>
          <img src={iconMap}></img>
          <h3>No se selecciono ningun lugar aun</h3>
        </div>
      )}
      {showMenuRoutes && <MenuRoute />}

      {showPhotos && (
        <Modal>
          <PhotosList place={selectedPlace} />
        </Modal>
      )}

      {newQuiz && (
        <Modal>
          <FormAddQuizProvider>
            <FormAdd />
          </FormAddQuizProvider>
        </Modal>
      )}
      {showListQuizes && (
        <Modal>
          <ListQuizesProvider>
            <ListUserQuizes />
          </ListQuizesProvider>
        </Modal>
      )}
    </>
  );
};
