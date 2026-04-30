const MAPS_API_KEY_BACKOFFICE = import.meta.env.VITE_MAPS_API_KEY_BACKOFFICE;
import styles from "./NeighborhoodsCrimes.module.css";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { AddWithList } from "./containTable/addWithList/AddWithList";
import { Modal } from "../modal/Modal";
import { Header } from "../header/Header";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { AddNeighborhoodCrimeProvider } from "../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";
import { ContainMap } from "./containMap/ContainMap";
import { APIProvider } from "@vis.gl/react-google-maps";

export const NeighborhoodsCrimes = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.neighborhoodsCrimes}>
          <MenuSide />
          <div className={styles.body}>
            <Header
              title={"Indice de denuncias de delitos en barrios"}
              setAddForm={setAddForm}
            />

            {addForm &&
              createPortal(
                <Modal>
                  <AddNeighborhoodCrimeProvider>
                    <AddWithList setAddForm={setAddForm} />
                  </AddNeighborhoodCrimeProvider>
                </Modal>,
                document.body
              )}

            <div className={styles.row}>
              <APIProvider apiKey={MAPS_API_KEY_BACKOFFICE}>
                <ContainMap />
              </APIProvider>
              <ContainTable />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
