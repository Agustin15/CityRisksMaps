import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconNeighborhoods from "../../../../../assets/img/neighborhoods.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Edit } from "../edit/Edit";
import { Delete } from "../delete/Delete";

export const BodyTable = () => {
  const [editDepartment, setEditDepartment] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);
  const { loading, registers } = useCrud();
  let navigate = useNavigate();

  const handleNeighborhoods = (department) => {
    navigate(
      "/admin/barrios/departamento/" +
        "getNeighborhoodsByIdDepartmentOffset/" +
        department.idDepartment
    );
  };

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((department, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{department.idDepartment}</td>
            <td>{department.name}</td>
            <td>
              <div className={styles.options}>
                <button
                  onClick={() => setDeleteDepartment(department.name)}
                  className={styles.delete}
                >
                  <img src={iconDelete}></img>
                </button>

                <button
                  onClick={() => setEditDepartment(department.name)}
                  className={styles.edit}
                >
                  <img src={iconEdit}></img>
                </button>
                <button
                  onClick={() => handleNeighborhoods(department)}
                  className={styles.neighborhoods}
                >
                  <img src={iconNeighborhoods}></img>
                </button>
              </div>
            </td>
            {editDepartment == department.name &&
              createPortal(
                <Modal>
                  <Edit
                    department={department}
                    setEditDepartment={setEditDepartment}
                  />
                </Modal>,
                document.body
              )}
            {deleteDepartment == department.name &&
              createPortal(
                <Modal>
                  <Delete
                    department={department}
                    setDeleteDepartment={setDeleteDepartment}
                  />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
