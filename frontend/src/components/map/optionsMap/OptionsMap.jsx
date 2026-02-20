import { PhotosList } from "../placeDetails/photosList/photosList";
import { Modal } from "../modal/Modal";
import { ViewStatistics } from "./viewStatistics/ViewStatistics.jsx";
import { ViewPlaces } from "./viewPlaces/ViewPlaces.jsx";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { usePhotosPlace } from "../../../contexts/PhotosContext";
import { useWindowResize } from "../../../contexts/WindowResizeContext.jsx";
import { useNavigation } from "../../../contexts/NavigationContext.jsx";

export const OptionsMap = () => {
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
    </>
  );
};
