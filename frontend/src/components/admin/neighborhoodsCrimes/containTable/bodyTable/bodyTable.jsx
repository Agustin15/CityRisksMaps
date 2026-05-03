import styles from "./BodyTable.module.css";
import iconIncrease from "../../../../../assets/img/increase.png";
import iconDecrease from "../../../../../assets/img/decrease.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useAuth } from "../../../../../contexts/adminContext/AuthContext";
import { useMap } from "@vis.gl/react-google-maps";
import { ColorRate } from "../../containMap/colorRate/ColorRate";
import { Options } from "./options/Options";
import { useInteractionNeighborhoodsPolygons } from "../../../../../contexts/adminContext/InteractionNeighborhoodsPolygons";

export const BodyTable = () => {
  const { loading, registers, crimeSelected } = useCrud();
  const { user } = useAuth();
  const { focusNeighborhoodPolygon } = useInteractionNeighborhoodsPolygons();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((nhCrime, index) => (
          <tr
            onClick={() => focusNeighborhoodPolygon(nhCrime.name)}
            key={index}
            className={index % 2 == 0 ? styles.trGray : ""}
          >
            <td>
              <div className={styles.nameNeighborhood}>
                <ColorRate rate={nhCrime.rate} crime={crimeSelected} />
                {nhCrime.name}
              </div>
            </td>
            <td>{nhCrime.quantity}</td>
            <td>{nhCrime.rate}</td>
            <td>
              <div className={styles.containIncrease}>
                {nhCrime.increase != null ? (
                  <span
                    className={
                      nhCrime.increase > 0 ? styles.increase : styles.decrease
                    }
                  >
                    {nhCrime.increase}%
                  </span>
                ) : (
                  "Sin datos"
                )}
                {nhCrime.increase != null && nhCrime.increase != 0 && (
                  <img
                    src={nhCrime.increase > 0 ? iconIncrease : iconDecrease}
                  ></img>
                )}
              </div>
            </td>

            <Options user={user} nhCrime={nhCrime} />
          </tr>
        ))}
    </tbody>
  );
};
