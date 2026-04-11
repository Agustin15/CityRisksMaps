import styles from "./NeighborhoodsCrimes.module.css";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Add } from "./containTable/add/Add";
import { AddWithList } from "./containTable/addWithList/AddWithList";
import { Modal } from "../modal/Modal";
import { Header } from "../header/Header";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";


export const NeighborhoodsCrimes = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);
  const [addWithListForm, setAddWithListForm] = useState(false);

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
              setAddWithListForm={setAddWithListForm}
            />
            {addForm &&
              createPortal(
                <Modal>
                  <Add setAddForm={setAddForm} />
                </Modal>,
                document.body
              )}
            {addWithListForm &&
              createPortal(
                <Modal>
                  <AddWithList setAddWithListForm={setAddWithListForm} />
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
