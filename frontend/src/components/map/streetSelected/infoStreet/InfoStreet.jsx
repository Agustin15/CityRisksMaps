import styles from "./InfoStreet.module.css";
import iconDestination from "../../../../assets/img/destination.png";
import { findComponentAddress } from "../functions";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";

export const InfoStreet = ({ streetSelected, lat, lng }) => {
  const { handleClickRoute } = useRoutes();

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
            {street.long_name +
              " " +
              (streetNumber ? streetNumber.long_name : "")}
          </li>
        )}
        <li>
          <div className={styles.postalCode}></div>
          <span>Codigo Postal:</span>
          {postalCode.long_name}
        </li>
        <li>
          <div className={styles.coordinates}></div>
          <span>Coordenadas:</span>
          {lng()}, {lat()}
        </li>
      </div>

      <li className={styles.containBtnIndications}>
        <button
          className={styles.btnIndications}
          onClick={() =>
            handleClickRoute(streetSelected[0].formatted_address, {
              lat: lat(),
              lng: lng()
            })
          }
        >
          Ver indicaciones
          <img src={iconDestination}></img>
        </button>
      </li>
    </ul>
  );
};
