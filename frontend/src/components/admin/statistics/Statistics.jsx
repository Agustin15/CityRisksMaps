import styles from "./Statistics.module.css";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { MenuSide } from "../menuSide/MenuSide";
import { ChartIncreaseCategoryCrime } from "./chartIncreaseCategoryCrime/ChartIncreaseCategoryCrime";
import { useEffect } from "react";

export const Statistics = () => {
  const { user, loadingProfile, getProfile } = useAuth();

  useEffect(() => {
    if (user) return;
    getProfile();
  }, []);
  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.statistics}>
          <MenuSide />
          <div className={styles.body}>
            <div className={styles.header}>
              <h3>Estadisticas</h3>
            </div>
            <div className={styles.row}>
              <ChartIncreaseCategoryCrime />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
