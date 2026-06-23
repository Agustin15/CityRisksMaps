import styles from "./Statistics.module.css";
import iconStatistics from "../../../assets/img/iconStatistics.png";
import iconMenuBackoffice from "../../../assets/img/menuBackoffice.png";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useEffect, useState } from "react";
import { MenuSide } from "../menuSide/MenuSide";
import { Menu } from "./menu/Menu";
import { ChartIncreaseCategoryCrime } from "./chartIncreaseCategoryCrime/ChartIncreaseCategoryCrime";
import { ChartIncreaseOfCrimeInNeighborhood } from "./chartIncreaseOfCrimeInNeighborhood/ChartIncreaseOfCrimeInNeighborhood";
import { Helmet } from "react-helmet-async";
import { ChartAmountDifferentCrimesInNeighborhood } from "./chartAmountDifferentCrimesInNeighborhood/ChartAmountDifferentCrimesInNeighborhood";
import { ChartAmountOfCrimeInNeighborhoodsByYear } from "./chartAmountOfCrimeInNeighborhoods/ChartAmountOfCrimeInNeighborhoods";
import { useMenuResponsive } from "../../../contexts/MenuResponsiveContext";

export const Statistics = () => {
  const { user, loadingProfile, getProfile } = useAuth();
  const { handleClick } = useMenuResponsive();
  const [selected, setSelected] = useState("IncreaseCategoryCrime");

  useEffect(() => {
    document.querySelector("body").style.overflowY = "scroll";
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
                <button onClick={handleClick} className={styles.displayMenu}>
                  <img src={iconMenuBackoffice}></img>
                </button>
              </div>
              <Menu setSelected={setSelected} selected={selected} />
            </div>

            <div className={styles.row}>
              {selected == "IncreaseCategoryCrime" && (
                <ChartIncreaseCategoryCrime />
              )}
              {selected == "IncreaseCategoryCrimeInHood" && (
                <ChartIncreaseOfCrimeInNeighborhood />
              )}
              {selected == "AmountDifferentCrimesInNeighborhoodAndYear" && (
                <ChartAmountDifferentCrimesInNeighborhood />
              )}
              {selected == "AmountOfCrimeInNeighborhoodsByYear" && (
                <ChartAmountOfCrimeInNeighborhoodsByYear />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
