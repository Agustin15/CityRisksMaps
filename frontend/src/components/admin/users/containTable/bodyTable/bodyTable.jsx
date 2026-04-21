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
import { useAuth } from "../../../../../contexts/adminContext/AuthContext.jsx";

export const BodyTable = () => {
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);
  const { loading, registers } = useCrud();
  const { roleName } = useParams();
  const { user } = useAuth();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((userRegister, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{userRegister.idUser}</td>
            <td>{userRegister.name}</td>
            <td>{userRegister.lastname}</td>
            <td>{formatDate(new Date(userRegister.created))}</td>
            <td>
              {userRegister.lastModified
                ? formatDate(new Date(userRegister.lastModified))
                : "Sin modificaciones"}
            </td>
            <td>
              <div className={styles.options}>
                {!roleName && (
                  <>
                    <button
                      disabled={userRegister.idUser == user.idUser}
                      onClick={() => setDeleteUser(userRegister.idUser)}
                      className={
                        userRegister.idUser == user.idUser
                          ? styles.deleteDisabled
                          : styles.delete
                      }
                    >
                      <img src={iconDelete}></img>
                    </button>

                    <button
                      disabled={userRegister.idUser == user.idUser}
                      onClick={() => setEditUser(userRegister.idUser)}
                      className={
                        userRegister.idUser == user.idUser
                          ? styles.editDisabled
                          : styles.edit
                      }
                    >
                      <img src={iconEdit}></img>
                    </button>
                  </>
                )}
                <button
                  disabled={userRegister.idUser == user.idUser}
                  className={
                    userRegister.idUser == user.idUser
                      ? styles.detailsDisabled
                      : styles.details
                  }
                  onClick={() => setDetailsUser(userRegister.idUser)}
                >
                  <img src={iconInfo}></img>
                </button>
              </div>
            </td>
            {editUser == userRegister.idUser &&
              createPortal(
                <Modal>
                  <Edit user={userRegister} setEditUser={setEditUser} />
                </Modal>,
                document.body
              )}
            {deleteUser == userRegister.idUser &&
              createPortal(
                <Modal>
                  <Delete user={userRegister} setDeleteUser={setDeleteUser} />
                </Modal>,
                document.body
              )}
            {detailsUser == userRegister.idUser &&
              createPortal(
                <Modal>
                  <Details
                    user={userRegister}
                    setDetailsUser={setDetailsUser}
                  />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
