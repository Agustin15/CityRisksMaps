import styles from "./Neighborhoods.module.css";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Modal } from "../modal/Modal";
import { Add } from "./containTable/add/Add";
import { createPortal } from "react-dom";
import { Header } from "../header/Header";
import { MenuResponsiveProvider } from "../../../contexts/MenuResponsiveContext";
import { Helmet } from "react-helmet-async";

export const Neighborhoods = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  let title =
    "Lista de barrios" +
    (!params.departmentName ? "" : " de " + params.departmentName);

  return (
    <>
      {user && !loadingProfile && (
        <MenuResponsiveProvider>
          <div className={styles.neighborhoods}>
            <Helmet>
              <title>Administracion-Barrios</title>
              <meta name="robots" content="noindex"></meta>
            </Helmet>
            <MenuSide />
            <div className={styles.body}>
              <Header title={title} setAddForm={setAddForm} />
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
        </MenuResponsiveProvider>
      )}
    </>
  );
};
