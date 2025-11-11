import styles from "./InfoWindowNeighborhood.module.css";

export const InfoWindowNeighborhood = ({ polygonSelected }) => {
  return (
    <div className={styles.infoWindowPolygon}>
      <div className={styles.row}>
        <span>{polygonSelected.data.name}</span>
        <div style={{ background: polygonSelected.data.rateColor }}></div>
      </div>
      <p>
        Denuncias de
        {" " +
          polygonSelected.data.categoryCrime +
          ":" +
          +(polygonSelected.data.quantityCrime == null
            ? "Sin Datos"
            : polygonSelected.data.quantityCrime)}
      </p>
    </div>
  );
};
