import styles from "./EditProfile.module.css";
import iconEditProfile from "../../../assets/img/editProfile.png";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useEffect } from "react";
import { MenuSide } from "../menuSide/MenuSide";
import { Details } from "./details/Details.jsx";
import { Form } from "./form/Form.jsx";

export const EditProfile = () => {
  const { loadingProfile, user, getProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <>
      {user && !loadingProfile && (
        <div className={styles.editProfile}>
          <MenuSide />
          <div className={styles.body}>
            <div className={styles.header}>
              <h3>Editar datos del perfil</h3>
              <img src={iconEditProfile}></img>
            </div>

            <div className={styles.row}>
              <Details user={user} />
              <Form user={user}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
