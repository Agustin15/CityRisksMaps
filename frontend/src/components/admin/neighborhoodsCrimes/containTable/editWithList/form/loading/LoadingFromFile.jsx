import styles from "./LoadingFromFile.module.css";
import { useAddNeighborhoodCrime } from "../../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";

export const LoadingFromFile = ({ crime }) => {
  return (
    <div className={styles.loadingFromFile}>
      <div className={styles.content}>
        <h3>Cargando denuncias de {crime}s:</h3>
        <span>Espera,esto puede tardar unos minutos ...</span>

        <span className={styles.loader}></span>
      </div>
    </div>
  );
};
