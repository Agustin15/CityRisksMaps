const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import styles from "./Options.module.css";
import { matchPath, useLocation } from "react-router";

export const Options = ({ user }) => {
  const location = useLocation();
  return (
    <ul className={styles.options}>
      <li
        className={
          matchPath(
            {
              path: "/admin/departamentos",
              caseSensitive: true
            },
            location.pathname
          )
            ? styles.selected
            : ""
        }
      >
        <div className={styles.iconDepartments}></div>
        <a href={LOCALHOST_FRONTEND + "/admin/departamentos"}>Departamentos</a>
      </li>
      <li
        className={
          matchPath(
            {
              path: "/admin/barrios/",
              caseSensitive: true
            },
            location.pathname
          )
            ? styles.selected
            : ""
        }
      >
        <div className={styles.iconNeighborhoods}></div>
        <a href={LOCALHOST_FRONTEND + "/admin/barrios"}>Barrios</a>
      </li>
      <li
        className={
          matchPath(
            {
              path: "/admin/poblaciones/",
              caseSensitive: true
            },
            location.pathname
          )
            ? styles.selected
            : ""
        }
      >
        <div className={styles.iconPopulation}></div>
        <a href={LOCALHOST_FRONTEND + "/admin/poblaciones"}>Poblaciones</a>
      </li>

      <li
        className={
          matchPath(
            {
              path: "/admin/categorias-delitos/",
              caseSensitive: true
            },
            location.pathname
          )
            ? styles.selected
            : ""
        }
      >
        <div className={styles.iconCrimes}></div>
        <a href={LOCALHOST_FRONTEND + "/admin/categorias-delitos"}>
          Categoria de delitos
        </a>
      </li>

      <li>
        <div className={styles.iconNeighborhoodsCrimes}></div>
        <a href={LOCALHOST_FRONTEND + "/admin/categorias-delitos-barrios"}>
          Indice delitos barrios
        </a>
      </li>

      {user.rol == "Admin" && (
        <>
          <li
            className={
              matchPath(
                {
                  path: "/admin/roles/",
                  caseSensitive: true
                },
                location.pathname
              )
                ? styles.selected
                : ""
            }
          >
            <div className={styles.iconRols}></div>
            <a href={LOCALHOST_FRONTEND + "/admin/roles"}> Roles</a>
          </li>
          <li
            className={
              matchPath(
                {
                  path: "/admin/usuarios/",
                  caseSensitive: true
                },
                location.pathname
              )
                ? styles.selected
                : ""
            }
          >
            <div className={styles.iconUsers}></div>
            <a href={LOCALHOST_FRONTEND + "/admin/usuarios"}> Usuarios</a>
          </li>
        </>
      )}
    </ul>
  );
};
