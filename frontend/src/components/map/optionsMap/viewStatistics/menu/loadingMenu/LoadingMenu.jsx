import styles from "./LoadingMenu.module.css";

export const LoadingMenu = () => {
  return (
    <div className={styles.containLoader}>
      <p>Cargando opciones...</p>
      <span className={styles.loader}></span>
    </div>
  );
};
