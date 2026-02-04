import styles from "./PhotosList.module.css";
import next from "../../../../assets/img/next.png";
import prev from "../../../../assets/img/prev.png";
import noData from "../../../../assets/img/imageNotFound.png";
import { useEffect, useState } from "react";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";

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
      <ul className={styles.list}>
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
          <li>
            <div className={styles.containImage}>
              <img
                src={photosDetails.length > 0 && photosDetails[index].url}
              ></img>
            </div>
            {photosDetails[index].author && (
              <div className={styles.author}>
                <b>Autor:</b>
                <img src={photosDetails[index].author.photoUri}></img>
                <a href={photosDetails[index].author.uri}>
                  {photosDetails[index].author.displayName}
                </a>
              </div>
            )}
          </li>
        )}
      </ul>

      <div className={styles.options}>
        <button onClick={() => index > 0 && setIndex(index - 1)}>
          <img src={prev}></img>
        </button>
        <span>
          {index + 1}/{photosDetails.length}
        </span>
        <button
          onClick={() =>
            index + 1 < photosDetails.length && setIndex(index + 1)
          }
        >
          <img src={next}></img>
        </button>
      </div>
    </div>
  );
};
