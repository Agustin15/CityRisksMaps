const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./MenuSide.module.css";
import iconLogo from "../../../assets/img/logo.png";
import iconSubmenu from "../../../assets/img/submenu.png";
import iconLogout from "../../../assets/img/logout.png";
import { alertSwalErrorAdmin } from "../../sweetAlert/sweetAlert.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useMenuResponsive } from "../../../contexts/MenuResponsiveContext.jsx";
import { Options } from "./options/Options";

export const MenuSide = () => {
  const { setUser, user } = useAuth();
  const { classname, handleClick } = useMenuResponsive();

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
    <nav className={classname}>
      <div className={styles.contentMenu}>
        <div className={styles.title}>
          <div className={styles.background}>
            <img src={iconLogo}></img>
          </div>
          <h3>IndiceDelitosMdveo</h3>
        </div>

        <button onClick={handleClick} className={styles.btnHideMenu}>
          <img src={iconSubmenu}></img>
        </button>

        <Options user={user} />

        <div className={styles.avatar}>
          <div className={styles.row}>
            <div className={styles.avatarImg}>
              {user.name.substring(0, 1) + "" + user.lastname.substring(0, 1)}
            </div>
            <div className={styles.avatarInfo}>
              <span className={styles.avatarRole}>{user.rol}</span>
              <a href="/admin/editar-perfil" className={styles.avatarName}>
                {user.name + " " + user.lastname}
              </a>
            </div>
            
            <label htmlFor="checkboxLogout">
              <img src={iconSubmenu}></img>
            </label>
            <input id="checkboxLogout" type="checkbox"></input>
          </div>

          <div className={styles.logout}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <img src={iconLogout} />
            </button>
            <span>Cerrar sesión</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
