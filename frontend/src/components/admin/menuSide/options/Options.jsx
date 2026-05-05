const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import styles from "./Options.module.css";
import { matchPath, useLocation } from "react-router";

export const Options = ({ user }) => {
  const location = useLocation();

  const options = [
    {
      title: "Departamentos",
      path: "/admin/departamentos",
      divStyle: styles.iconDepartments
    },
    {
      title: "Barrios",
      path: "/admin/barrios",
      divStyle: styles.iconNeighborhoods,
      allow: true
    },
    {
      title: "Poblaciones",
      path: "/admin/poblaciones",
      divStyle: styles.iconPopulation,
      allow: true
    },
    {
      title: "Categorias de delitos",
      path: "/admin/categorias-delitos",
      divStyle: styles.iconCrimes,
      allow: true
    },
    {
      title: "Indice delitos barrios",
      path: "/admin/indice-delitos-barrios",
      divStyle: styles.iconNeighborhoodsCrimes,
      allow: true
    },

    {
      title: "Estadisticas",
      path: "/admin/estadisticas",
      divStyle: styles.iconStatistics,
      allow: true
    },
    {
      title: "Roles",
      path: "/admin/roles",
      divStyle: styles.iconRols,
      allow: user.rol == "Admin"
    },
    {
      title: "Usuarios",
      path: "/admin/usuarios",
      divStyle: styles.iconUsers,
      allow: user.rol == "Admin"
    }
  ];

  let optionsAllowed = options.filter((option) => option.allow == true);

  return (
    <ul className={styles.options}>
      {optionsAllowed.map((option, index) => (
        <li
          key={index}
          className={
            matchPath(
              {
                path: option.path,
                caseSensitive: true
              },
              location.pathname
            )
              ? styles.selected
              : ""
          }
        >
          <div className={option.divStyle}></div>
          <a href={LOCALHOST_FRONTEND + option.path}>{option.title}</a>
        </li>
      ))}
    </ul>
  );
};
