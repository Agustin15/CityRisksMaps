import styles from "./InfoWindowNeighborhood.module.css";

export const InfoWindowNeighborhood = ({ polygonSelected }) => {
  return (
    <div className={styles.infoWindowPolygon}>
      <div className={styles.row}>
        <span>{polygonSelected.data.name}</span>
        <div style={{ background: polygonSelected.data.rateColor }}></div>
      </div>
      {polygonSelected.data.type == "crime" ? (
        <p>
          Denuncias de
          {" " +
            polygonSelected.data.categoryCrime +
            ":" +
            +(polygonSelected.data.quantityCrime == null
              ? "Sin Datos"
              : polygonSelected.data.quantityCrime)}
        </p>
      ) : (
        <p>
          Percepcion de seguridad:
          {polygonSelected.data.total == 0
            ? "Sin encuestas"
            : polygonSelected.data.percentage+"%"}
         
        </p>
      )}
    </div>
  );
};
