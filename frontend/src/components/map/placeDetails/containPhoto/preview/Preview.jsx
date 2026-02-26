import styles from "./Preview.module.css";
import { usePhotosPlace } from "../../../../../contexts/PhotosContext";

export const Preview = ({ photosList }) => {
  const { setShowPhotos, setIndexSelected } = usePhotosPlace();

  const handleViewList = (index) => {
    setIndexSelected(index);
    setShowPhotos(true);
  };

  return (
    <ul className={styles.preview}>
      <li className={styles.containThreePhotos}>
        {photosList.map(
          (photo, index) =>
            index % 3 == 0 && (
              <li key={index}>
                <img
                  onClick={() => handleViewList(index)}
                  className={styles.imageBig}
                  src={photo.url}
                ></img>

                <div className={styles.column}>
                  {photosList[index + 1] && (
                    <img
                      onClick={() => handleViewList(index + 1)}
                      className={styles.imageSmall}
                      src={photosList[index + 1].url}
                    ></img>
                  )}

                  {photosList[index + 2] && (
                    <img
                      onClick={() => handleViewList(index + 2)}
                      className={styles.imageSmall}
                      src={photosList[index + 2].url}
                    ></img>
                  )}
                </div>
              </li>
            )
        )}
      </li>
    </ul>
  );
};
