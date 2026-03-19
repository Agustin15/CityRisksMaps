import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconNeighborhoods from "../../../../../assets/img/neighborhoods.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Edit } from "../edit/Edit";
import { Delete } from "../delete/Delete";

export const BodyTable = () => {
  const [editDepartment, setEditDepartment] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);
  const { loading, registers } = useCrud();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((department, index) => (
          <tr key={index} className={index == 0 ? styles.trGray : ""}>
            <td>{department.idDepartment}</td>
            <td>{department.name}</td>
            <td>
              <div className={styles.options}>
                <button
                  onClick={() => setDeleteDepartment(department)}
                  className={styles.delete}
                >
                  <img src={iconDelete}></img>
                </button>

                <button
                  onClick={() => setEditDepartment(department)}
                  className={styles.edit}
                >
                  <img src={iconEdit}></img>
                </button>
                <button className={styles.neighborhoods}>
                  <img src={iconNeighborhoods}></img>
                </button>
              </div>
            </td>
            {editDepartment == department &&
              createPortal(
                <Modal>
                  <Edit
                    department={department}
                    setEditDepartment={setEditDepartment}
                  />
                </Modal>,
                document.body
              )}
            {deleteDepartment == department &&
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
