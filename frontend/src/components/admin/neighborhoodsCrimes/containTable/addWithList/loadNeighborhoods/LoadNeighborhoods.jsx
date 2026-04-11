const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { useNavigate } from "react-router";
import styles from "./LoadNeighborhoods.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext";

export const LoadNeighborhoods = ({
  values,
  setValues,
  neighborhoods,
  setNeighborhoods
}) => {
  const [loading, setLoading] = useState(false);
  const [errorLoad, setErrorLoad] = useState(null);
  const { setUser } = useAuth();
  let navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        LOCALHOST_BACKEND + "/neighborhood/allNeighborhoods",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          setUser();
          navigate("/admin/login");
        } else throw new Error(result.messageError);
      }

      values.neighborhoodsCrime = result.map((neighborhood) => {
        return {
          nameNeighborhood: neighborhood.name,
          amount: null
        };
      });
      setNeighborhoods(result);
    } catch (error) {
      setErrorLoad(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event, neighborhoodName) => {
    const newNeighborhoodsCrime = values.neighborhoodsCrime.map((nhCrime) => {
      if (nhCrime.nameNeighborhood == neighborhoodName) {
        console.log(event.target.value.length);
        if (event.target.value != null && event.target.value.length == 0) {
          nhCrime.amount = null;
        } else nhCrime.amount = event.target.value;
      }

      return nhCrime;
    });

    setValues({
      ...values,
      ["neighborhoodsCrime"]: newNeighborhoodsCrime
    });
  };

  return (
    <div className={styles.loadNeighborhoods}>
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
                        handleChange(event, neighborhood.name)
                      }
                      name={neighborhood.name}
                      min={0}
                      type="number"
                      placeholder="Cantidad"
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
