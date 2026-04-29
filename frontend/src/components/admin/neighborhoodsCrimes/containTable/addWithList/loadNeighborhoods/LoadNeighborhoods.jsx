import styles from "./LoadNeighborhoods.module.css";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext";
import { useAddNeighborhoodCrime } from "../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext.jsx";
import { LoadData } from "./LoadData";
import { SelectAllNeighborhoods } from "./allSelect/SelectAllNeighborhoods.jsx";
import {
  handleChangeInput,
  handleChangeCheckbox,
  verifyChecked,
  setValueAmount
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
          <SelectAllNeighborhoods
            neighborhoodsSelected={neighborhoodsSelected}
            setNeighborhoodsSelected={setNeighborhoodsSelected}
          />
          <table>
            <tbody>
              {neighborhoods.map((neighborhood, index) => (
                <tr key={index}>
                  <td>{neighborhood.name}</td>
                  <td>
                    <input
                      onChange={(event) =>
                        handleChangeInput(
                          event,
                          neighborhood.name,
                          values,
                          setValues
                        )
                      }
                      disabled={
                        verifyChecked(
                          neighborhoodsSelected,
                          neighborhood.name
                        ) == false
                      }
                      className={
                        verifyChecked(
                          neighborhoodsSelected,
                          neighborhood.name
                        ) == false
                          ? styles.inputDisabled
                          : ""
                      }
                      value={setValueAmount(
                        values.neighborhoodsCrime,
                        neighborhood.name
                      )}
                      name={neighborhood.name}
                      min={0}
                      type="number"
                      placeholder="Cantidad"
                    ></input>

                    <input
                      onChange={(event) =>
                        handleChangeCheckbox(
                          neighborhood.name,
                          neighborhoodsSelected,
                          setNeighborhoodsSelected
                        )
                      }
                      checked={verifyChecked(
                        neighborhoodsSelected,
                        neighborhood.name
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
