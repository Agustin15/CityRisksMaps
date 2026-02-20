import styles from "./DetailsRow.module.css";
import { Chart } from "../../../../chart/Chart";
import { PolygonDraw } from "./polygonDraw/PolygonDraw";

export const DetailsRow = ({ neighborhoodCrime, crime }) => {
  return (
    <div className={styles.moreDetails}>
      <h4>{neighborhoodCrime.name}</h4>

      <PolygonDraw
        neighborhoodCrime={neighborhoodCrime}
        categoryCrime={crime}
      />
      <Chart categoryCrime={crime} nameNeighborhood={neighborhoodCrime.name} />
    </div>
  );
};
