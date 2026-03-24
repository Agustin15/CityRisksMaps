import styles from "./Populations.module.css";
import { MenuSide } from "../MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Modal } from "../modal/Modal";
import { Add } from "./containTable/add/Add";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { Header } from "../header/Header";
import { useParams } from "react-router";

export const Populations = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  let title =
    "Lista de poblaciones" +
    (!params.name ? " en barrios" : " de " + params.name);

  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.populations}>
          <MenuSide />
          <div className={styles.body}>
            <Header
              title={title}
              setAddForm={setAddForm}
              route={"/population/"}
              controller={"getPopulationsOffsetByYear"}
            />
            {addForm &&
              createPortal(
                <Modal>
                  <Add setAddForm={setAddForm} />
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
