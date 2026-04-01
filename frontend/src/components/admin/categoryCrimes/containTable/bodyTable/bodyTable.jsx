import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconMoreInfo from "../../../../../assets/img/moreInfo.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Edit } from "../edit/Edit";
import { Delete } from "../delete/Delete";
import { Details } from "../details/Details";
import { formatDate } from "../../../functions.js";
import { useAuth } from "../../../../../contexts/adminContext/AuthContext.jsx";

export const BodyTable = () => {
  const [editCrime, setEditCrime] = useState(null);
  const [deleteCrime, setDeleteCrime] = useState(null);
  const [detailsCrime, setDetailsCrime] = useState(null);
  const { loading, registers } = useCrud();
  const { user } = useAuth();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((crime, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{crime.category}</td>
            <td>{formatDate(new Date(crime.created))}</td>
            <td>
              {crime.lastModified
                ? formatDate(new Date(crime.lastModified))
                : "Sin modificaciones"}
            </td>
            <td>
              <div className={styles.options}>
                {user.rol == "Admin" && (
                  <>
                    <button
                      onClick={() => setDeleteCrime(crime.category)}
                      className={styles.delete}
                    >
                      <img src={iconDelete}></img>
                    </button>

                    <button
                      onClick={() => setEditCrime(crime.category)}
                      className={styles.edit}
                    >
                      <img src={iconEdit}></img>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setDetailsCrime(crime.category)}
                  className={styles.details}
                >
                  <img src={iconMoreInfo}></img>
                </button>
              </div>
            </td>
            {editCrime == crime.category &&
              createPortal(
                <Modal>
                  <Edit crime={crime} setEditCrime={setEditCrime} />
                </Modal>,
                document.body
              )}
            {deleteCrime == crime.category &&
              createPortal(
                <Modal>
                  <Delete crime={crime} setDeleteCrime={setDeleteCrime} />
                </Modal>,
                document.body
              )}
            {detailsCrime == crime.category &&
              createPortal(
                <Modal>
                  <Details crime={crime} setDetailsCrime={setDetailsCrime} />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
