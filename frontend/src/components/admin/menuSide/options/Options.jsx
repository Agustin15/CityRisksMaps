const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import styles from "./Options.module.css";
import { matchPath, useLocation } from "react-router";

export const Options = ({ user }) => {
  const location = useLocation();

  const options = [
    {
      title: "Departamentos",
      paths: ["/admin/departamentos"],
      divStyle: styles.iconDepartments,
      allow: true
    },
    {
      title: "Barrios",
      paths: ["/admin/barrios", "/admin/barrios/departamento/:nombre"],
      divStyle: styles.iconNeighborhoods,
      allow: true
    },
    {
      title: "Poblaciones",
      paths: ["/admin/poblaciones", "/admin/poblaciones/barrio/:nombre"],
      divStyle: styles.iconPopulation,
      allow: true
    },
    {
      title: "Categorias de delitos",
      paths: ["/admin/categorias-delitos"],
      divStyle: styles.iconCrimes,
      allow: true
    },
    {
      title: "Indice delitos barrios",
      paths: ["/admin/indice-delitos-barrios"],
      divStyle: styles.iconNeighborhoodsCrimes,
      allow: true
    },

    {
      title: "Estadisticas",
      paths: ["/admin/estadisticas"],
      divStyle: styles.iconStatistics,
      allow: true
    },
    {
      title: "Roles",
      paths: ["/admin/roles"],
      divStyle: styles.iconRols,
      allow: user.rol == "Admin"
    },
    {
      title: "Usuarios",
      paths: ["/admin/usuarios", "/admin/usuarios/rol/:nombre"],
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
            option.paths.some((path) => matchPath(path, location.pathname))
              ? styles.selected
              : ""
          }
        >
          <div className={option.divStyle}></div>
          <a href={LOCALHOST_FRONTEND + option.paths[0]}>{option.title}</a>
        </li>
      ))}
    </ul>
  );
};
