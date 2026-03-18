import styles from "./Departments.module.css";
import { MenuSide } from "../MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { CrudProvider } from "../../../contexts/adminContext/CrudContext";
import { redirect, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useEffect } from "react";

export const Departments = () => {
  const { user } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/login");
  }, []);
  return (
    <>
      {user && (
        <CrudProvider>
          <div className={styles.departments}>
            <MenuSide />
            <div className={styles.body}>
              <div className={styles.title}>
                <h3>Lista de departamentos</h3>
              </div>
              <ContainTable />
            </div>
          </div>
        </CrudProvider>
      )}
    </>
  );
};
