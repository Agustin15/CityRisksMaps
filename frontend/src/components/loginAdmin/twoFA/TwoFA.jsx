import styles from "./TwoFA.module.css";
import iconLogo from "../../../assets/img/logo.png";

export const TwoFA = () => {
  const keyboard = [
    ["1", "2", "3",],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", "Borrar"]
  ];

  return (
    <div className={styles.twoFA}>
      <div className={styles.containForm}>
        <div className={styles.title}>
          <img src={iconLogo}></img>
          <div className={styles.titleText}>
            <h3>IndiceDelitosMontevideo</h3>
            <p>
              Ingrese el codigo de verificacion que se envio a la casilla de su
              correo electronico
            </p>
          </div>
        </div>

        <div className={styles.columnInput}>
          <label>Ingresar codigo:</label>
          <input
            inputMode="numeric"
            type="text"
            placeholder="* * * * * *"
          ></input>

          <ul className={styles.keyboard}>
            {keyboard.map((row) => (
              <li>
                <ul>
                  {row.map((key) => (
                    <li>
                      <button>{key}</button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
