import styles from "./Details.module.css";
import iconDetails from "../../../../../assets/img/moreInfo.png";

export const Details = ({ crime, setDetailsCrime }) => {
  return (
    <div className={styles.details}>
      <div className={styles.header}>
        <img src={iconDetails}></img>
        <h3>Detalles</h3>
        <button onClick={() => setDetailsCrime(null)}>Cerrar</button>
      </div>

      <div className={styles.category}>
        <span>Categoria de delito:</span>
        {crime.category}
      </div>

      <div className={styles.description}>
        <span>Descripcion:</span>
        <p>{crime.description}</p>
      </div>
    </div>
  );
};
