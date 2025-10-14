import styles from "./DetailsStreet.module.css";

export const DetailsStreet = ({ infoWindow }) => {
  return (
    <div className={styles.containDetailsStreet}>
      <div className={styles.column}>
        <h3>{infoWindow.address_descriptor.areas[0].display_name.text}</h3>
        <span>
          {infoWindow.results[0].address_components[0].formatted_address}
        </span>
      </div>
    </div>
  );
};
