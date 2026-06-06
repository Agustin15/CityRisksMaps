import styles from "./Record.module.css";
import iconAuditory from "../../../../../assets/img/auditoryTitle.png";
import { useEffect, useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { List } from "./list/List";
import { Pagination } from "./pagination/Pagination";

export const Record = ({ dateSelected, loadingFilter }) => {
  const { loading, fetchGet, error, setRegisters, registers, setPages, pages } =
    useCrud();

  useEffect(() => {
    if (!dateSelected) return;
    loadRegisters();
  }, [dateSelected]);

  const loadRegisters = async () => {
    const result = await fetchGet(
      "/auditoryNeighborhoodCrime/auditoryNeighborhoodsCrimesOffsetByDate/" +
        encodeURIComponent(dateSelected) +
        "/" +
        0
    );

    if (result) {
      setPages(result.pages);
      setRegisters(result.registersOffset);
    }
  };

  return (
    <div className={styles.record}>
      {(loadingFilter || loading) && (
        <div className={styles.loading}>
          <h3>Cargando datos...</h3>
        </div>
      )}

      {error && !loadingFilter && !loading && (
        <div className={styles.noData}>
          <img src={iconAuditory} />
          <h3>{error}</h3>
        </div>
      )}

      {!loading && !loadingFilter && registers && (
        <List registers={registers} />
      )}

      {!loading && !loadingFilter && pages && (
        <Pagination dateSelected={dateSelected} />
      )}
    </div>
  );
};
