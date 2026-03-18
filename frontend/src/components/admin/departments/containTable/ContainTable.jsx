const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./ContainTable.module.css";
import iconAdd from "../../../../assets/img/add.png";
import { useState } from "react";
import { LoadData } from "./LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { useCrudContext } from "../../../../contexts/adminContext/CrudContext";

export const ContainTable = () => {
  const { fetchGet } = useCrudContext();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState();
  const [pages, setPages] = useState();
  const [index, setIndex] = useState(0);
  const [error, setError] = useState();

  const handleClickPage = (page) => {
    setIndex(page);
    let url = localhostBackend + "/departments/";
    let params = JSON.stringify({
      option: "getDepartmentsOffset",
      offset: page * 10
    });
    fetchGet(url + params, "GET", setLoading);
  };

  return (
    <div className={styles.containTable}>
      <LoadData
        setDepartments={setDepartments}
        setPages={setPages}
        setError={setError}
        setLoading={setLoading}
      />
      <div className={styles.controls}>
        <button>
          <span>Agregar</span>
          <img src={iconAdd}></img>
        </button>
        <input type="text" placeholder="Buscar..."></input>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID Departamento</th>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <BodyTable loading={loading} error={error} departments={departments} />
      </table>

      <div className={styles.pagination}>
        <ul>
          {pages &&
            Array.from({ length: pages }, (v, index) => index).map((page) => (
              <li key={page}>
                <button
                  className={index == page ? styles.disabled : ""}
                  onClick={() => handleClickPage(page)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
