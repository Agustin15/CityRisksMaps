import iconNavigation from "../../../assets/img/navigator.png";

export const Navigation = () => {
  return (
    <div className={styles.navigation}>
      <div className={styles.header}>
        <div>
          Navegacion
          <img src={iconNavigation}></img>
        </div>
        <button>x</button>
      </div>
    </div>
  );
};
