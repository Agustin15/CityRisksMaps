import styles from "./Details.module.css";
import { useRef, useState } from "react";
import { formatDate } from "../../functions.js";
import { Enable2FA } from "./Enable2FA/Enable2FA.jsx";

export const Details = ({ user }) => {
  return (
    <div className={styles.containDetails}>
      <div className={styles.avatar}>
        <div className={styles.avatarImg}>
          {user.name.substring(0, 1) + "" + user.lastname.substring(0, 1)}
        </div>

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
      <Enable2FA />
    </div>
  );
};
