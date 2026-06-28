import styles from "./InfoStreet.module.css";
import { ButtonIndications } from "./buttonIndications/ButtonIndicatios";
import { findComponentAddress } from "../functions";

export const InfoStreet = ({ streetSelected, lat, lng }) => {
  let street = findComponentAddress(["route", "establishment"], streetSelected);
  let streetNumber = findComponentAddress(["street_number"], streetSelected);
  let postalCode = findComponentAddress(["postal_code"], streetSelected);
  return (
    <ul className={styles.infoStreet}>
      <div className={styles.columnOne}>
        {street && (
          <li>
            <div className={styles.address}></div>
            <span>Direccion:</span>
            <p>
              {street.long_name +
                " " +
                (streetNumber ? streetNumber.long_name : "")}
            </p>
          </li>
        )}
        <li className={styles.itemPostalCode}>
          <div className={styles.postalCode}></div>
          <span>Codigo Postal:</span>
          {postalCode.long_name}
        </li>

        <li>
          <div className={styles.coordinates}></div>
          <span>Coordenadas:</span>
          <p>{lat() + "," + lng()}</p>
        </li>
      </div>

      <li className={styles.containBtnIndications}></li>
    </ul>
  );
};
