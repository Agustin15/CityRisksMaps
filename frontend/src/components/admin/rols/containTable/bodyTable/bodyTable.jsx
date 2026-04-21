import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconUsers from "../../../../../assets/img/users.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Edit } from "../edit/Edit";
import { Delete } from "../delete/Delete";
import { formatDate } from "../../../functions.js";
import { useNavigate } from "react-router";

export const BodyTable = () => {
  let navigate = useNavigate();
  const [editRole, setEditRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const { loading, registers, setRegisters } = useCrud();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((role, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{role.idRol}</td>
            <td>{role.name}</td>
            <td>{formatDate(new Date(role.created))}</td>
            <td>
              {role.lastModified
                ? formatDate(new Date(role.lastModified))
                : "Sin modificaciones"}
            </td>
            <td>
              <div className={styles.options}>
                <button
                  onClick={() => setDeleteRole(role.idRol)}
                  className={styles.delete}
                >
                  <img src={iconDelete}></img>
                </button>

                <button
                  onClick={() => setEditRole(role.idRol)}
                  className={styles.edit}
                >
                  <img src={iconEdit}></img>
                </button>
                <button
                  onClick={() => {
                    setRegisters();
                    navigate(`/admin/usuarios/rol/${role.name}`);
                  }}
                  className={styles.users}
                >
                  <img src={iconUsers}></img>
                </button>
              </div>
            </td>
            {editRole == role.idRol &&
              createPortal(
                <Modal>
                  <Edit role={role} setEditRole={setEditRole} />
                </Modal>,
                document.body
              )}
            {deleteRole == role.idRol &&
              createPortal(
                <Modal>
                  <Delete role={role} setDeleteRole={setDeleteRole} />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
