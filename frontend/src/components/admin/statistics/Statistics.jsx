import styles from "./Statistics.module.css";
import iconStatistics from "../../../assets/img/iconStatistics.png";
import iconChartLine from "../../../assets/img/chartLine.png";
import iconChartColumn from "../../../assets/img/chartColumn.png";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useEffect, useState } from "react";
import { MenuSide } from "../menuSide/MenuSide";
import { ChartIncreaseCategoryCrime } from "./chartIncreaseCategoryCrime/ChartIncreaseCategoryCrime";
import { ChartAmountCrimeInNeighborhood } from "./chartAmountCrimeInNeighborhood/chartAmountCrimeInNeighborhood";
import { Helmet } from "react-helmet-async";

export const Statistics = () => {
  const { user, loadingProfile, getProfile } = useAuth();
  const [selected, setSelected] = useState("IncreaseCategoryCrime");

  useEffect(() => {
    if (user) return;
    getProfile();
  }, []);
  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.statistics}>
          <Helmet>
            <title>Administracion-Estadisticas delitos barrios</title>
            <meta name="robots" content="noindex"></meta>
          </Helmet>
          <MenuSide />
          <div className={styles.body}>
            <div className={styles.header}>
              <div className={styles.row}>
                <h3>Estadisticas</h3>
                <img src={iconStatistics}></img>
              </div>
              <ul>
                <li
                  className={
                    selected == "IncreaseCategoryCrime" ? styles.selected : ""
                  }
                  onClick={() => setSelected("IncreaseCategoryCrime")}
                >
                  <img src={iconChartLine}></img>
                  <span>Crecimiento de un tipo de crimen</span>
                </li>
                <li
                  className={
                    selected == "IncreaseCategoryCrimeInHood"
                      ? styles.selected
                      : ""
                  }
                  onClick={() => setSelected("IncreaseCategoryCrimeInHood")}
                >
                  <img src={iconChartLine}></img>

                  <span>Tipo de crimen en un barrio</span>
                </li>
                <li onClick={() => setSelected("CategoryCrimesInHoodAndYear")}>
                  <img src={iconChartColumn}></img>
                  <span>Crimenes en barrio por año</span>
                </li>
              </ul>
            </div>
            <div className={styles.row}>
              {selected == "IncreaseCategoryCrime" && (
                <ChartIncreaseCategoryCrime />
              )}
              {selected == "IncreaseCategoryCrimeInHood" && (
                <ChartAmountCrimeInNeighborhood />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
