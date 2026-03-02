import styles from "./InfoStreet.module.css";
import { useWindowResize } from "../../../../contexts/WindowResizeContext";
import { ButtonIndications } from "./buttonIndications/ButtonIndicatios";
import { findComponentAddress } from "../functions";

export const InfoStreet = ({ streetSelected, lat, lng }) => {
  const { windowWidth } = useWindowResize();

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

          {windowWidth < 1200 && (
            <ButtonIndications
              streetSelected={streetSelected}
              lat={lat}
              lng={lng}
            />
          )}
        </li>

        <li>
          <div className={styles.coordinates}></div>
          <span>Coordenadas:</span>
          <p>{lng() + "," + lat()}</p>
        </li>
      </div>

      {windowWidth >= 1200 && (
        <li className={styles.containBtnIndications}>
          <ButtonIndications
            streetSelected={streetSelected}
            lat={lat}
            lng={lng}
          />
        </li>
      )}
    </ul>
  );
};
