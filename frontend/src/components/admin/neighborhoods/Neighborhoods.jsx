import styles from "./Neighborhoods.module.css";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Modal } from "../modal/Modal";
import { Add } from "./containTable/add/Add";
import { createPortal } from "react-dom";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useEffect, useState } from "react";
import { Header } from "../header/Header";
import { useParams } from "react-router";

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
        <div className={styles.neighborhoods}>
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
      )}
    </>
  );
};
