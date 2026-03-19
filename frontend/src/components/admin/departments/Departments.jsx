import styles from "./Departments.module.css";
import iconAdd from "../../../assets/img/add.png";
import { MenuSide } from "../MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { Add } from "./containTable/add/Add";
import { Modal } from "../modal/Modal";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useCrud } from "../../../contexts/adminContext/CrudContext";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const Departments = () => {
  const [cookies] = useCookies();
  let navigate = useNavigate();
  const [addForm, setAddForm] = useState(false);
  const { searcher } = useCrud();

  useEffect(() => {
    if (cookies.nameAndLastname) return;
    if (!cookies.nameAndLastname) navigate("/admin/login");
  }, []);

  return (
    <>
      {cookies.nameAndLastname && (
        <div className={styles.departments}>
          <MenuSide />
          <div className={styles.body}>
            <div className={styles.header}>
              <h3>Lista de departamentos</h3>
              <div className={styles.controls}>
                <button onClick={() => setAddForm(true)}>
                  <span>Agregar</span>
                  <img src={iconAdd}></img>
                </button>
                <input
                  onChange={(event) => searcher(event.target.value)}
                  type="text"
                  placeholder="Buscar..."
                ></input>
              </div>
            </div>
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
