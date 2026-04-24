import styles from "./Details.module.css";
import { useRef, useState } from "react";
import { formatDate } from "../../functions.js";
import { UploadAvatar } from "./uploadAvatar/UploadAvatar.jsx";

export const Details = ({ user }) => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <div className={styles.containDetails}>
      <div className={styles.avatar}>
        <div className={styles.avatarImg}>
          {(loadingDelete || loadingUpdate) && (
            <span className={styles.loading}></span>
          )}
          {user.avatarUrl ? (
            <img src={user.avatarUrl}></img>
          ) : (
            user.name.substring(0, 1) + "" + user.lastname.substring(0, 1)
          )}
        </div>

        <UploadAvatar
          loadingUpdate={loadingUpdate}
          setLoadingUpdate={setLoadingUpdate}
          loadingDelete={loadingDelete}
          setLoadingDelete={setLoadingDelete}
        />
        <div className={styles.containTable}>
          <table>
            <thead>
              <tr>
                <th colSpan={2}>
                  <h3>Detalles</h3>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <b>Nombre completo</b>
                </td>
                <td className={styles.value}>
                  {user.name} {user.lastname}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Correo</b>
                </td>
                <td className={styles.value}>{user.email} </td>
              </tr>
              <tr>
                <td className={styles.name}>
                  <b>Rol</b>
                </td>
                <td className={styles.value}>{user.rol}</td>
              </tr>
              <tr>
                <td>
                  <b>Se unio</b>
                </td>
                <td className={styles.value}>
                  {formatDate(new Date(user.created))}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Ultima Modificacion</b>
                </td>
                <td className={styles.value}>
                  {user.lastModified
                    ? formatDate(new Date(user.lastModified))
                    : "Sin modificaciones"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
