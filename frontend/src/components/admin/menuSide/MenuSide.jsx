const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./MenuSide.module.css";
import iconLogo from "../../../assets/img/logo.png";
import iconLogout from "../../../assets/img/logout.png";
import { alertSwalErrorAdmin } from "../../sweetAlert/sweetAlert.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { Options } from "./options/Options";

export const MenuSide = () => {
  const { setUser, user } = useAuth();
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(LOCALHOST_BACKEND + "/admin/logout/", {
        method: "POST",
        credentials: "include"
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);
      if (result) {
        setUser();
        navigate("/admin/login");
      }
    } catch (error) {
      return alertSwalErrorAdmin(
        "Ups, no se pudo cerrar sesion correctamente",
        "Vuelva a intentarlo mas tarde"
      );
    }
  };

  return (
    <nav className={styles.menu}>
      <div className={styles.contentMenu}>
        <div className={styles.avatar}>
          <div className={styles.avatarImg}>
            {user.name.substring(0, 1) + "" + user.lastname.substring(0, 1)}
          </div>
          <div className={styles.avatarInfo}>
            <span className={styles.avatarRole}>{user.rol}</span>
            <a href="/admin/editar-perfil" className={styles.avatarName}>
              {user.name + " " + user.lastname}
            </a>
          </div>
        </div>
        <Options user={user} />
        <div className={styles.logout}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <img src={iconLogout} />
          </button>
          <span>Cerrar sesión</span>
        </div>
      </div>
    </nav>
  );
};
