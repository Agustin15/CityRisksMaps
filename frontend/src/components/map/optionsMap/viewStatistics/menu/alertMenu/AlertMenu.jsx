import styles from "./AlertMenu.module.css";
import iconNotData from "../../../../../../assets/img/notDataAlert.png";

export const AlertMenu = ({
  title,
  msj,
  doneOption,
  setCloseAlert,
  setErrorLoad
}) => {
  return (
    <div className={styles.containLoader}>
      <div className={styles.box}>
        <div className={styles.header}>{title}</div>

        <div className={styles.msj}>
          {doneOption == true ? (
            <img src={iconNotData}></img>
          ) : (
            <div className={styles.loader}>
              <div className={styles.loaderColor}></div>
            </div>
          )}

          <p
            className={
              doneOption == null ? styles.msjLoading : styles.msjNotData
            }
          >
            {msj}
          </p>
        </div>
        {doneOption == true && (
          <button
            onClick={() => {
              setErrorLoad();
              setCloseAlert(false);
            }}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};
