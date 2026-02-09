import styles from "./PhotosList.module.css";
import noData from "../../../../assets/img/imageNotFound.png";
import { useEffect, useState } from "react";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";
import { Options } from "./options/Options";
import { PhotosDetails } from "./photosDetails/PhotosDetails";

export const PhotosList = ({ place }) => {
  const { getPhotoDetails, setShowPhotos, setLoadingMore, loadingMore } =
    usePhotosPlace();
  const [photosDetails, setPhotosDetails] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    createPhotosList();
  }, []);

  const createPhotosList = async () => {
    setLoadingMore(true);

    const photosList = await Promise.all(
      place.photos.map(async (photo) => {
        let url = await getPhotoDetails(photo.name, 340, 865);

        return {
          url: url,
          author:
            photo.authorAttributions.length > 0
              ? photo.authorAttributions[0]
              : null
        };
      })
    );

    if (photosList) setPhotosDetails(photosList);

    setLoadingMore(false);
  };

  return (
    <div className={styles.containList}>
      <div className={styles.containClose}>
        <button onClick={() => setShowPhotos(false)}>X</button>
      </div>

      {loadingMore && (
        <div className={styles.containLoading}>
          <span className={styles.loader}></span>
        </div>
      )}

      {!loadingMore && photosDetails.length == 0 && (
        <div className={styles.noData}>
          <img src={noData}></img>
          <span>Error inesperado al cargar las imagenes</span>
        </div>
      )}

      {!loadingMore && photosDetails.length > 0 && (
        <PhotosDetails photosDetails={photosDetails} index={index} />
      )}

      <Options
        setIndex={setIndex}
        index={index}
        photosDetails={photosDetails}
      />
    </div>
  );
};
