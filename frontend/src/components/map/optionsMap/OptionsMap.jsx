import { PhotosList } from "../placeDetails/photosList/photosList";
import { Modal } from "../modal/Modal";
import { FormAddQuizProvider } from "../../../contexts/quizesContext/FormAddQuizContext";
import { FormAdd } from "../quizes/formAdd/FormAdd";
import { ListQuizesProvider } from "../../../contexts/quizesContext/ListQuizesContext";
import { ListUserQuizes } from "../quizes/listUserQuizes/ListUserQuizes";
import { ViewStatistics } from "./viewStatistics/ViewStatistics.jsx";
import { ViewPlaces } from "./viewPlaces/ViewPlaces.jsx";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { usePhotosPlace } from "../../../contexts/PhotosContext";
import { useQuizes } from "../../../contexts/quizesContext/QuizesContext";
import { useWindowResize } from "../../../contexts/WindowResizeContext.jsx";
import { useNavigation } from "../../../contexts/NavigationContext.jsx";

export const OptionsMap = () => {
  const { newQuiz, showListQuizes } = useQuizes();
  const { showPhotos } = usePhotosPlace();
  const { selectedPlace, placesSearched } = useSearchPlace();
  const { windowWidth } = useWindowResize();
  const { routeNavigation } = useNavigation();

  return (
    <>
      <ViewStatistics />

      {((windowWidth >= 1200 && !routeNavigation) ||
        (selectedPlace && !routeNavigation) ||
        placesSearched) && <ViewPlaces />}

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
