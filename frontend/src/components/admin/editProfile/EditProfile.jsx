import styles from "./EditProfile.module.css";
import iconEditProfile from "../../../assets/img/editProfile.png";
import iconMenuBackoffice from "../../../assets/img/menuBackoffice.png";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useEffect } from "react";
import { useMenuResponsive } from "../../../contexts/MenuResponsiveContext.jsx";
import { MenuSide } from "../menuSide/MenuSide";
import { Details } from "./details/Details.jsx";
import { Form } from "./form/Form.jsx";
import { Helmet } from "react-helmet-async";

export const EditProfile = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const { handleClick } = useMenuResponsive();

  useEffect(() => {
    document.querySelector("body").style.overflowY = "scroll";
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.editProfile}>
          <Helmet>
            <title>Administracion-Editar perfil</title>
            <meta name="robots" content="noindex"></meta>
          </Helmet>
          <MenuSide />
          <div className={styles.body}>
            <div className={styles.header}>
              <button onClick={handleClick} className={styles.displayMenu}>
                <img src={iconMenuBackoffice}></img>
              </button>
              <h3>Editar datos del perfil</h3>
              <img src={iconEditProfile}></img>
            </div>

            <div className={styles.row}>
              <div className={styles.headerDetails}>
                <h3>Panel de detalles usuario</h3>
              </div>
              <Details user={user} />
              <Form user={user} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
