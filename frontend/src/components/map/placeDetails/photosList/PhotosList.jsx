import { useEffect, useState } from "react";
import { useMapControls } from "../../../../contexts/MapContext";
import styles from "./PhotosList.module.css";

export const PhotosList = ({ photos }) => {
  const { getPhotoDetails } = useMapControls();
  const [imagesUrls, setImagesUrls] = useState([]);

  useEffect(() => {
    createPhotosList();
  }, []);

  const createPhotosList = async () => {
    setImagesUrls(
      await Promise.all(
        photos.map(async (photo) => {
          await getPhotoDetails(photo.name);
        })
      )
    );
  };

  return <ul className={styles.list}>
    {imagesUrls.map(imageUrl=>(
        <li>
          
        </li>
    ))}
  </ul>;
};
