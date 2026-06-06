import styles from "./Auditory.module.css";
import iconAuditory from "../../../../assets/img/auditoryTitle.png";
import { MenuSide } from "../../menuSide/MenuSide";
import { useState } from "react";
import { useAuth } from "../../../../contexts/adminContext/AuthContext";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Record } from "./record/Record";
import { Dates } from "./dates/Dates";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";

export const Auditory = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const { fetchGet } = useCrud();
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [dates, setDates] = useState([]);
  const [dateSelected, setDateSelected] = useState(null);
  const [loadingFilter, setLoadingFilter] = useState(false);

  useEffect(() => {
    if (!user) {
      getProfile();
    }
    loadDates();
  }, []);

  const loadDates = async () => {
    const datesResults = await fetchGet(
      "/auditoryNeighborhoodCrime/datesOfAuditoryNeighborhoodsCrimes",
      setLoadingFilter
    );

    if (datesResults) {
      setDates(datesResults);
      setDateSelected(datesResults[0]);
    }
  };

  return (
    <>
      {user && user.rol == "Admin" && !loadingProfile && (
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
              {dates.length > 0 && (
                <Dates dates={dates} setDateSelected={setDateSelected} />
              )}
            </div>

            <Record dateSelected={dateSelected} loadingFilter={loadingFilter} />
          </div>
        </div>
      )}
    </>
  );
};
