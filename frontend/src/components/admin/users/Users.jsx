import styles from "./Users.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useParams } from "react-router";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Add } from "./containTable/add/Add";
import { Modal } from "../modal/Modal";
import { Header } from "../header/Header";
import { createPortal } from "react-dom";
import { Helmet } from "react-helmet-async";
import { MenuResponsiveProvider } from "../../../contexts/MenuResponsiveContext";

export const Users = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);
  const { roleName } = useParams();

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <>
      {user && user.rol == "Admin" && !loadingProfile && (
        <MenuResponsiveProvider>
          <div className={styles.users}>
            <Helmet>
              <title>Administracion-Usuarios</title>
              <meta name="robots" content="noindex"></meta>
            </Helmet>
            <MenuSide />
            <div className={styles.body}>
              <Header
                title={"Lista de Usuarios" + (roleName ? ` ${roleName}` : "")}
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
