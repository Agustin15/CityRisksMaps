import styles from "./Options.module.css";

export const getListOptions = (user) => {
  return [
    {
      title: "Departamentos",
      paths: ["/admin/departamentos"],
      divStyle: styles.iconDepartments,
      allow: true
    },
    {
      title: "Barrios",
      paths: ["/admin/barrios", "admin/barrios/departamento/:nombre"],
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
      allow: true,
      submenu: {
        title: "Auditoria",
        paths: ["/admin/indice-delitos-barrios/auditoria"],
        divStyle: styles.iconAuditoryNeighborhoodsCrimes,
        allow: user.rol == "Admin"
      }
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
};
