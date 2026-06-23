import styles from "./Departments.module.css";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Add } from "./containTable/add/Add";
import { Modal } from "../modal/Modal";
import { Header } from "../header/Header";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { Helmet } from "react-helmet-async";
import { MenuResponsiveProvider } from "../../../contexts/MenuResponsiveContext";

export const Departments = () => {
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
        <MenuResponsiveProvider>
          <div className={styles.departments}>
            <Helmet>
              <title>Administracion-Departamentos</title>
              <meta name="robots" content="noindex"></meta>
            </Helmet>

            <MenuSide />

            <div className={styles.body}>
              <Header
                title={"Lista de departamentos"}
                setAddForm={setAddForm}
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
        </MenuResponsiveProvider>
      )}
    </>
  );
};
