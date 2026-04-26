import styles from "./NeighborhoodsCrimes.module.css";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { AddWithList } from "./containTable/addWithList/AddWithList";
import { Modal } from "../modal/Modal";
import { Header } from "../header/Header";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { AddNeighborhoodCrimeProvider } from "../../../contexts/adminContext/AddNeighborhoodCrimeContext";

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
              title={"Categoria del delitos en barrios"}
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
            <ContainTable />
          </div>
        </div>
      )}
    </>
  );
};
