import styles from "./Populations.module.css";
import { MenuSide } from "../MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Modal } from "../modal/Modal";
import { Add } from "./containTable/add/Add";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Header } from "../header/Header";

export const Populations = () => {
  const [cookies] = useCookies();
  let navigate = useNavigate();
  const [addForm, setAddForm] = useState(false);

  useEffect(() => {
    if (cookies.nameAndLastname) return;
    if (!cookies.nameAndLastname) navigate("/admin/login");
  }, []);

  return (
    <>
      {cookies.nameAndLastname && (
        <div className={styles.populations}>
          <MenuSide />
          <div className={styles.body}>
            <Header
              title={"Lista de poblaciones en barrios"}
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
      )}
    </>
  );
};
