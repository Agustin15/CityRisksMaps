import styles from "./Auditory.module.css";
import iconAuditory from "../../../../assets/img/auditoryTitle.png";
import { MenuSide } from "../../menuSide/MenuSide";
import { useState } from "react";
import { useAuth } from "../../../../contexts/adminContext/AuthContext";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Record } from "./record/Record";

export const Auditory = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.auditory}>
          <Helmet>
            <title>
              Administracion-Auditoria de los datos de delitos en barrios
            </title>
            <meta name="robots" content="noindex"></meta>
          </Helmet>
          <MenuSide />

          <div className={styles.body}>
            <div className={styles.header}>
              <div className={styles.title}>
                <h2>Auditoria de registros de delitos en barrios</h2>
                <img src={iconAuditory} />
              </div>
            </div>

            <Record></Record>
          </div>
        </div>
      )}
    </>
  );
};
