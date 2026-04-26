import styles from "./LoadNeighborhoods.module.css";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext";
import { useAddNeighborhoodCrime } from "../../../../../../contexts/adminContext/AddNeighborhoodCrimeContext";
import { LoadData } from "./LoadData";
import {
  handleChange,
  handleCheckbox,
  verifyInputEnable
} from "./functions.js";

export const LoadNeighborhoods = ({ neighborhoods, setNeighborhoods }) => {
  const [loading, setLoading] = useState(false);
  const [errorLoad, setErrorLoad] = useState(null);
  const { values, setValues, neighborhoodsSelected, setNeighborhoodsSelected } =
    useAddNeighborhoodCrime();

  return (
    <div className={styles.loadNeighborhoods}>
      <LoadData
        setLoading={setLoading}
        setErrorLoad={setErrorLoad}
        setNeighborhoods={setNeighborhoods}
      />

      {loading && <p>Cargando barrios...</p>}
      {errorLoad && <p>{errorLoad}</p>}
      {loading == false && neighborhoods.length > 0 && (
        <div className={styles.neighborhoodsTable}>
          <table>
            <tbody>
              {neighborhoods.map((neighborhood, index) => (
                <tr key={index}>
                  <td>{neighborhood.name}</td>
                  <td>
                    <input
                      onChange={(event) =>
                        handleChange(
                          event,
                          neighborhood.name,
                          values,
                          setValues
                        )
                      }
                      disabled={!verifyInputEnable(neighborhood.name)}
                      className={
                        !verifyInputEnable(
                          neighborhood.name,
                          neighborhoodsSelected
                        )
                          ? styles.inputDisabled
                          : ""
                      }
                      name={neighborhood.name}
                      min={0}
                      type="number"
                      placeholder="Cantidad"
                    ></input>
                    <input
                      onChange={(event) =>
                        handleCheckbox(
                          neighborhood.name,
                          setNeighborhoodsSelected
                        )
                      }
                      defaultChecked={verifyInputEnable(
                        neighborhood.name,
                        neighborhoodsSelected
                      )}
                      type="checkbox"
                    ></input>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
