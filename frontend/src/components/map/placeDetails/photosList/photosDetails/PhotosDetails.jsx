import styles from "./PhotosDetails.module.css";

export const PhotosDetails = ({ photosDetails, index }) => {
  return (
    <ul className={styles.list}>
      <li className={styles.photo}>
        <div className={styles.containImage}>
          <img src={photosDetails.length > 0 && photosDetails[index].url}></img>
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
    </ul>
  );
};
