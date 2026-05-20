import styles from "./Populations.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Modal } from "../modal/Modal";
import { Add } from "./containTable/add/Add";
import { createPortal } from "react-dom";
import { Header } from "../header/Header";
import { Helmet } from "react-helmet-async";

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
    (!params.neighborhoodName
      ? " en barrios"
      : " de " + params.neighborhoodName);

  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.populations}>
          <Helmet>
            <title>Administracion-Poblaciones</title>
            <meta name="robots" content="noindex"></meta>
          </Helmet>
          <MenuSide />
          <div className={styles.body}>
            <Header
              title={title}
              setAddForm={setAddForm}
              route={"/population/populationsOffsetYear"}
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
