import styles from "./Loading.module.css";

export const Loading = () => {
  return (
    <div className={styles.containLoader}>
      Cargando datos...
      <span className={styles.loader}></span>
    </div>
  );
};
