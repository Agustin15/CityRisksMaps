import styles from "./DetailsNeighborhoods.module.css";

export const DetailsNeighborhood = ({ polygonSelected }) => {
  return (
    <div className={styles.detailsNeighborhood}>
      <p className={styles.name}>
        {polygonSelected.data.neighborhood}
        {" (Tasa de " +
          polygonSelected.data.crime +
          "s:" +
          polygonSelected.data.rateLevel +
          ")"}
        <div
          className={styles.rateColor}
          style={{ background: polygonSelected.data.rateColor }}
        ></div>
      </p>
      <p>
        Denuncias de {polygonSelected.data.crime}s:{" "}
        {polygonSelected.data.amount}
      </p>
      <p>
        Tasa de{" "}
        {polygonSelected.data.crime +
          "s cada 100.000 habitantes:" +
          polygonSelected.data.rate}
      </p>
    </div>
  );
};
