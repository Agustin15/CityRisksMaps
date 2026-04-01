import styles from "./Details.module.css";
import iconDetails from "../../../../../assets/img/moreInfo.png";
import { formatDate } from "../../../functions";

export const Details = ({ user, setDetailsUser }) => {
  return (
    <div className={styles.details}>
      <div className={styles.header}>
        <img src={iconDetails}></img>
        <h3>
          Detalles usuario {user.name} {user.lastname}
        </h3>
        <button onClick={() => setDetailsUser(null)}>Cerrar</button>
      </div>

      <ul className={styles.information}>
        <li>
          <span>Nombre:</span>
          {user.name}
        </li>
        <li>
          <span>Apellido:</span>
          {user.lastname}
        </li>
        <li>
          <span>Correo electrónico:</span>
          {user.email}
        </li>
        <li>
          <span>Rol en el sistema:</span>
          {user.nameRole}
        </li>
        <li>
          <span>Se unio:</span>
          {formatDate(new Date(user.created))}
        </li>
        <li>
          <span>Ultima modificacion:</span>
          {user.lastModified
            ? formatDate(new Date(user.lastModified))
            : "Sin modificaciones"}
        </li>
      </ul>
    </div>
  );
};
