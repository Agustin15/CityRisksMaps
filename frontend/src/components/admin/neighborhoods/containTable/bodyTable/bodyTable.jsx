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
  const [editNeighborhood, setEditNeighborhood] = useState(null);
  const [deleteNeighborhood, setDeleteNeighborhood] = useState(null);
  const { loading, registers } = useCrud();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((neighborhood, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{neighborhood.nameNeighborhood}</td>
            <td>{neighborhood.nameDepartment}</td>
            <td>
              <div className={styles.options}>
                <button
                  onClick={() =>
                    setDeleteNeighborhood(neighborhood.nameNeighborhood)
                  }
                  className={styles.delete}
                >
                  <img src={iconDelete}></img>
                </button>

                <button
                  onClick={() =>
                    setEditNeighborhood(neighborhood.nameNeighborhood)
                  }
                  className={styles.edit}
                >
                  <img src={iconEdit}></img>
                </button>
                <button className={styles.neighborhoods}>
                  <img src={iconNeighborhoods}></img>
                </button>
              </div>
            </td>
            {/* {editDepartment == department &&
              createPortal(
                <Modal>
                  <Edit
                    department={department}
                    setEditDepartment={setEditDepartment}
                  />
                </Modal>,
                document.body
              )} */}
            {deleteNeighborhood == neighborhood.nameNeighborhood &&
              createPortal(
                <Modal>
                  <Delete
                    neighborhood={neighborhood}
                    setDeleteNeighborhood={setDeleteNeighborhood}
                  />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
