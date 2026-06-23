import styles from "./Rols.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Add } from "./containTable/add/Add";
import { Modal } from "../modal/Modal";
import { Header } from "../header/Header";
import { createPortal } from "react-dom";
import { Helmet } from "react-helmet-async";
import { MenuResponsiveProvider } from "../../../contexts/MenuResponsiveContext";

export const Rols = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <>
      {user && user.rol == "Admin" && !loadingProfile && (
        <MenuResponsiveProvider>
          <div className={styles.rols}>
            <Helmet>
              <title>Administracion-Roles</title>
              <meta name="robots" content="noindex"></meta>
            </Helmet>

            <MenuSide />
            <div className={styles.body}>
              <Header title={"Lista de Roles"} setAddForm={setAddForm} />
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
