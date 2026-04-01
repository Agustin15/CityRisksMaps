import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconInfo from "../../../../../assets/img/moreInfo.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Edit } from "../edit/Edit";
import { Delete } from "../delete/Delete";
import { Details } from "../details/Details.jsx";
import { formatDate } from "../../../functions.js";
import { useParams } from "react-router";

export const BodyTable = () => {
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);
  const { loading, registers } = useCrud();
  const { roleName } = useParams();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((user, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{user.idUser}</td>
            <td>{user.name}</td>
            <td>{user.lastname}</td>
            <td>{formatDate(new Date(user.created))}</td>
            <td>
              {user.lastModified
                ? formatDate(new Date(user.lastModified))
                : "Sin modificaciones"}
            </td>
            <td>
              <div className={styles.options}>
                {!roleName && (
                  <>
                    <button
                      onClick={() => setDeleteUser(user.idUser)}
                      className={styles.delete}
                    >
                      <img src={iconDelete}></img>
                    </button>

                    <button
                      onClick={() => setEditUser(user.idUser)}
                      className={styles.edit}
                    >
                      <img src={iconEdit}></img>
                    </button>
                  </>
                )}
                <button
                  className={styles.details}
                  onClick={() => setDetailsUser(user.idUser)}
                >
                  <img src={iconInfo}></img>
                </button>
              </div>
            </td>
            {editUser == user.idUser &&
              createPortal(
                <Modal>
                  <Edit user={user} setEditUser={setEditUser} />
                </Modal>,
                document.body
              )}
            {deleteUser == user.idUser &&
              createPortal(
                <Modal>
                  <Delete user={user} setDeleteUser={setDeleteUser} />
                </Modal>,
                document.body
              )}
            {detailsUser == user.idUser &&
              createPortal(
                <Modal>
                  <Details user={user} setDetailsUser={setDetailsUser} />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
