import iconNavigation from "../../../assets/img/navigator.png";

export const Navigation = () => {
  return (
    <div className={styles.navigation}>
      <div className={styles.header}>
        <div className={styles.title}>
          Navegacion
          <img src={iconNavigation}></img>
        </div>
        <div className={styles.close}>
          <button>x</button>
        </div>
      </div>
    </div>
  );
};
